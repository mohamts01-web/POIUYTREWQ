/**
 * Credits Engine
 * 
 * This file implements the Reserve-Execute-Commit pattern for credits.
 * This ensures that credits are only deducted after a successful operation.
 * 
 * Pattern:
 * 1. Check balance
 * 2. Execute the operation
 * 3. Deduct credits (only if successful)
 * 4. Log event
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { logEvent } from './events'

/**
 * Get user's current credit balance
 */
export async function getBalance(userId: string): Promise<number> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('usage_credits')
        .select('credits_balance')
        .eq('user_id', userId)
        .single()

    if (error) {
        console.error('Failed to get balance:', error)
        return 0
    }

    return data?.credits_balance ?? 0
}

/**
 * Get user's full credit info including trial status
 */
export async function getUserCreditInfo(userId: string) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('usage_credits')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error) {
        console.error('Failed to get user credit info:', error)
        return null
    }

    return data
}

/**
 * PDF cost calculation with trial logic
 */
export function getPdfCost(trialUsed: boolean): number {
    return trialUsed ? 5 : 1
}

/**
 * Reserve-Execute-Commit Pattern
 * 
 * This function ensures credits are only deducted after successful execution.
 * If the operation fails, no credits are lost.
 * 
 * @param userId - The user ID
 * @param amount - Credits to deduct
 * @param action - Action name for logging
 * @param metadata - Additional metadata for logging
 * @param execute - The operation to execute
 * @returns The result of the execute function
 */
export async function withCredits<T>(
    userId: string,
    amount: number,
    action: string,
    metadata: object,
    execute: () => Promise<T>
): Promise<T> {
    const supabase = createAdminClient()

    // 1. Check balance
    const balance = await getBalance(userId)
    if (balance < amount) {
        throw new Error('INSUFFICIENT_CREDITS')
    }

    try {
        // 2. Execute the operation first
        const result = await execute()

        // 3. Deduct credits after successful execution (DB Transaction)
        const { data: success } = await supabase.rpc('deduct_credits_safe', {
            p_user_id: userId,
            p_amount: amount,
            p_action: action,
            p_metadata: metadata,
        })

        if (!success) {
            throw new Error('DEDUCTION_FAILED')
        }

        // 4. Log event
        await logEvent(userId, action as any, { amount, ...metadata })

        return result
    } catch (error) {
        // If execution failed, don't deduct credits
        if (error instanceof Error && error.message === 'INSUFFICIENT_CREDITS') {
            throw error
        }
        // Re-throw other errors
        throw error
    }
}

/**
 * Add credits to user (for orders/subscriptions)
 * 
 * @param userId - The user ID
 * @param amount - Credits to add
 * @param action - Action name for logging
 * @param metadata - Additional metadata
 */
export async function addCredits(
    userId: string,
    amount: number,
    action: string,
    metadata: object = {}
): Promise<void> {
    const supabase = createAdminClient()

    // Add credits
    const { error: updateError } = await supabase
        .from('usage_credits')
        .update({
            credits_balance: supabase.raw('credits_balance + ' + amount),
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

    if (updateError) {
        throw new Error('Failed to add credits')
    }

    // Log the addition
    await supabase.from('credits_log').insert({
        user_id: userId,
        action,
        amount,
        metadata,
    })

    // Log event
    await logEvent(userId, action as any, { amount, ...metadata })
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(
    userId: string,
    amount: number
): Promise<boolean> {
    const balance = await getBalance(userId)
    return balance >= amount
}

/**
 * Get credits log for a user
 */
export async function getCreditsLog(
    userId: string,
    limit: number = 20
): Promise<any[]> {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('credits_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Failed to get credits log:', error)
        return []
    }

    return data || []
}
