import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withCredits } from '@/lib/credits';
import { getCost } from '@/lib/feature-costs';
import { logEvent } from '@/lib/events';
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        await checkRateLimit(rateLimiters.cv_generate, userId);

        const { jobDescription, userData } = await req.json();

        // Check credits & deduct
        const generatedCV = await withCredits(
            userId,
            getCost('cv_generate'), // 10 credits
            'cv_generated',
            { job_title: jobDescription?.substring(0, 50) || 'AI Resume' },
            async () => {
                // OpenAI / OpenRouter Call
                const prompt = `Return ONLY valid JSON. No markdown. No explanation.
Based on: ${JSON.stringify(userData)} and job description (if any): ${jobDescription}

{
  "personalInfo": { "name": "...", "title": "...", "email": "...", "phone": "...", "address": "..." },
  "summary": "...",
  "skills": ["...", "..."],
  "experience": [{ "title": "...", "company": "...", "startDate": "...", "endDate": "...", "description": "..." }],
  "education": [{ "school": "...", "degree": "...", "field": "...", "year": "..." }]
}

Rules:
- Professional Arabic (or English if data is in English)
- Use action verbs
- If job description is provided, adapt to keywords
- Fill missing info with reasonable placeholders
- No Hallucination of factual data`;

                // Try calling the AI via OpenAI SDK pointed to OpenRouter or direct OpenRouter API
                const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }]
                    })
                });

                if (!res.ok) {
                    throw new Error('AI Provider error');
                }

                const json = await res.json();
                let cvData;

                try {
                    cvData = JSON.parse(json.choices[0].message.content);
                } catch {
                    const cleaned = json.choices[0].message.content.replace(/```json|```/g, '').trim();
                    cvData = JSON.parse(cleaned);
                }

                return cvData;
            }
        );

        await logEvent(userId, 'cv_generated', { template: 'ai' });

        return NextResponse.json({ cv: generatedCV });
    } catch (error: any) {
        if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
            return NextResponse.json({ error: 'تجاوزت الحد المسموح، يرجى المحاولة لاحقاً' }, { status: 429 });
        }
        if (error.message === 'INSUFFICIENT_CREDITS') {
            return NextResponse.json({ error: 'رصيد غير كافٍ' }, { status: 402 });
        }
        console.error('API Error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء التوليد' }, { status: 500 });
    }
}
