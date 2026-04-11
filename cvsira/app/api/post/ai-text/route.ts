import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withCredits } from '@/lib/credits';
import { getCost } from '@/lib/feature-costs';
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        await checkRateLimit(rateLimiters.ai_text, userId);

        const { type, name, additionalContext } = await req.json();

        const result = await withCredits(
            userId,
            getCost('post_ai_text'),
            'post_ai_text',
            { type },
            async () => {
                try {
                    const prompt = `اكتب نصًا عربيًا احترافيًا لمنشور ${type} للاسم ${name}.
${additionalContext ? `تفاصيل إضافية: ${additionalContext}` : ''}
أرجع ONLY JSON: { "variations": ["نص1", "نص2"] }
القيود: أقل من 50 كلمة لكل نص، احترافي، جذاب ويشمل إيموجي ومناسب لمنصة لينكدإن والتواصل الاجتماعي.`;

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

                    if (!res.ok) throw new Error('AI request failed');
                    
                    const json = await res.json();
                    let data;
                    try {
                        data = JSON.parse(json.choices[0].message.content);
                    } catch {
                        const cleaned = json.choices[0].message.content.replace(/```json|```/g, '').trim();
                        data = JSON.parse(cleaned);
                    }
                    
                    if (!data.variations || !Array.isArray(data.variations)) throw new Error('Invalid output structure');
                    
                    return data;
                } catch (e) {
                    console.error("AI Text Error, falling back...", e);
                    // Soft fall back UX as per plan
                    return {
                        variations: [
                            `${name} — نتمنى لكم أجمل الأوقات، فخورون بهذا الإنجاز 🌟`,
                            `مع تحيات ${name} بمناسبة هذا الحدث المميز ✨`
                        ],
                        is_fallback: true
                    };
                }
            }
        );

        return NextResponse.json(result);
    } catch (error: any) {
        if (error.message.includes('RATE_LIMIT_EXCEEDED')) return NextResponse.json({ error: 'تجاوزت الحد المسموح' }, { status: 429 });
        if (error.message === 'INSUFFICIENT_CREDITS') return NextResponse.json({ error: 'رصيد غير كافٍ' }, { status: 402 });
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}
