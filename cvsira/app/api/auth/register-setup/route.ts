import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();
        
        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // Use service_role client to bypass RLS
        const supabase = createAdminClient();

        // 1. Give 5 initial credits
        const { error: creditsError } = await supabase.from('usage_credits').upsert({
            user_id: userId,
            credits_balance: 5,
            subscription_plan: 'free',
            trial_pdf_used: false
        }, { onConflict: 'user_id' });

        if (creditsError) {
            console.error('Failed to create usage_credits', creditsError);
        }

        // 2. Add to Credits Log
        await supabase.from('credits_log').insert({
            user_id: userId,
            action: 'signup_bonus',
            amount: 5,
            metadata: { source: 'registration' }
        });

        // 3. Register Platform Event
        await supabase.from('platform_events').insert({
            user_id: userId,
            type: 'user_registered',
            payload: { plan: 'free', bonus_credits: 5 }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to setup user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
