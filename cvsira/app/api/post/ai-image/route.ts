import { NextResponse } from 'next/server';
import { FEATURES } from '@/lib/features';

export async function POST() {
    // Feature Flag Check
    if (!FEATURES.AI_IMAGE) {
        return NextResponse.json({
            error: 'FEATURE_DISABLED',
            message: 'ميزة توليد الصور قيد التطوير حالياً، يرجى المحاولة لاحقاً.'
        }, { status: 503 });
    }

    return NextResponse.json({ error: 'Not implemented core' }, { status: 501 });
}
