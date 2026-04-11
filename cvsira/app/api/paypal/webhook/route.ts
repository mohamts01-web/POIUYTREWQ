import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const event = await req.json();
        const supabase = await createClient();

        // 1. Idempotency Check & Order Fulfillment
        if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const captureId = event.resource.id;
            // In a real generic setup, PayPal sends custom_id back via the intent/purchase_units
            // Let's assume orderId was passed in custom_id
            const orderId = event.resource.custom_id; 

            if (!orderId) {
                return NextResponse.json({ error: 'Missing order ID in payload' }, { status: 400 });
            }

            // Check if this Capture was NOT processed already to ensure Idempotency
            const { data: existing } = await supabase
                .from('orders')
                .select('id, processed')
                .eq('paypal_capture_id', captureId)
                .single();

            // If it exists and processed, ignore safely
            if (existing && existing.processed) {
                return NextResponse.json({ ok: true, note: 'already_processed' });
            }

            // If we found the order by custom_id but it hasn't processed
            const { data: orderToProcess } = await supabase
                .from('orders')
                .select('id, processed')
                .eq('id', orderId)
                .single();

            if (!orderToProcess) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
            if (orderToProcess.processed) {
                 return NextResponse.json({ ok: true, note: 'already_processed_order' });
            }

            // Execute the DB function for safe execution
            const { error: rpcError } = await supabase.rpc('approve_order_safe', {
                p_order_id: orderToProcess.id,
                p_capture_id: captureId
            });

            if (rpcError) throw rpcError;
        }

        // 2. Subscription Renewals
        if (event.event_type === 'BILLING.SUBSCRIPTION.RENEWED') {
            const subscriptionId = event.resource.id;
            
            // Logic handled gracefully. Look up sub, reset credits, move date
            const { data: sub } = await supabase
                .from('subscriptions')
                .select('id, user_id, plan')
                .eq('paypal_subscription_id', subscriptionId)
                .single();

            if (sub) {
                const nextPeriod = new Date();
                nextPeriod.setMonth(nextPeriod.getMonth() + 1);

                // Add base credits for plans (100 Starter, 350 Pro)
                const credits = sub.plan === 'pro' ? 350 : 100;

                await supabase.from('subscriptions').update({ current_period_end: nextPeriod.toISOString() }).eq('id', sub.id);
                // Subscription reset logic
                await supabase.from('usage_credits').update({ credits_balance: credits, updated_at: new Date().toISOString() }).eq('user_id', sub.user_id);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error('PayPal Webhook Error:', e);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
