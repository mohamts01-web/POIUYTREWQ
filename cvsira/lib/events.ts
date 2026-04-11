/**
 * Event Logger
 * 
 * This file provides a unified way to log platform events
 * for analytics and monitoring purposes.
 */

import { createAdminClient } from '@/lib/supabase/admin'

export type EventType =
    | 'user_registered'
    | 'payment_completed'
    | 'subscription_renewed'
    | 'cv_generated'
    | 'pdf_downloaded'
    | 'post_created'
    | 'certificate_issued'
    | 'certificate_bulk_generated'
    | 'bulk_started'
    | 'bulk_completed'
    | 'credits_low'
    | 'trial_used'

/**
 * Log a platform event
 * 
 * @param userId - The user ID
 * @param type - The event type
 * @param payload - Additional event data (optional)
 */
export async function logEvent(
    userId: string,
    type: EventType,
    payload: object = {}
): Promise<void> {
    try {
        const supabase = createAdminClient()

        await supabase.from('platform_events').insert({
            user_id: userId,
            type,
            payload,
        })
    } catch (error) {
        console.error('Failed to log event:', error)
        // Don't throw - event logging shouldn't break the app
    }
}

/**
 * Log multiple events at once (for bulk operations)
 */
export async function logEvents(events: Array<{
    userId: string
    type: EventType
    payload?: object
}>): Promise<void> {
    try {
        const supabase = createAdminClient()

        await supabase.from('platform_events').insert(
            events.map(e => ({
                user_id: e.userId,
                type: e.type,
                payload: e.payload || {},
            }))
        )
    } catch (error) {
        console.error('Failed to log events:', error)
    }
}

/**
 * Get user events
 */
export async function getUserEvents(
    userId: string,
    limit: number = 50
): Promise<any[]> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('platform_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Failed to get user events:', error)
        return []
    }

    return data || []
}

/**
 * Get platform analytics (admin only)
 */
export async function getPlatformAnalytics(
    startDate?: Date,
    endDate?: Date
): Promise<any> {
    const supabase = createAdminClient()

    let query = supabase
        .from('platform_events')
        .select('type, created_at')

    if (startDate) {
        query = query.gte('created_at', startDate.toISOString())
    }
    if (endDate) {
        query = query.lte('created_at', endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
        console.error('Failed to get platform analytics:', error)
        return null
    }

    return data
}
