import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit';
import { withCredits, getPdfCost } from '@/lib/credits';
import { uploadAndStorePDF } from '@/lib/storage';
import { logEvent } from '@/lib/events';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        await checkRateLimit(rateLimiters.cv_download, userId);

        const { html, cvId, trialUsed } = await req.json();
        const cost = getPdfCost(trialUsed);

        // Implementation of Reserve-Execute-Commit Pattern
        const pdfUrl = await withCredits(
            userId,
            cost,
            'cv_pdf_download',
            { cv_id: cvId, cost, was_trial: !trialUsed },
            async () => {
                // Execute phase: 1. Generate PDF
                const puppeteerUrl = process.env.PUPPETEER_API_URL || 'http://localhost:3000/api/mock-pdf';
                const res = await fetch(puppeteerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ html })
                });

                if (!res.ok) {
                    throw new Error('PDF_GENERATION_FAILED');
                }

                const pdfBlob = await res.blob();

                // 2. Upload and store
                const generatedCvId = cvId || `temp-${Date.now()}`;
                const url = await uploadAndStorePDF(pdfBlob, userId, 'cv', generatedCvId);

                return url;
            }
        );

        // Update trial flag if it was their first time
        if (!trialUsed) {
            await supabase.from('usage_credits')
                .update({ trial_pdf_used: true })
                .eq('user_id', userId);
        }

        await logEvent(userId, 'pdf_downloaded', { cv_id: cvId, cost });

        return NextResponse.json({ pdf_url: pdfUrl });
    } catch (error: any) {
        if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
            return NextResponse.json({ error: 'تجاوزت الحد المسموح' }, { status: 429 });
        }
        if (error.message === 'INSUFFICIENT_CREDITS') {
            return NextResponse.json({ error: 'رصيد غير كافٍ' }, { status: 402 });
        }
        console.error('Download API Error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء تحميل السيرة الذاتية' }, { status: 500 });
    }
}
