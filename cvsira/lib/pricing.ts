/**
 * Pricing Engine
 *
 * This file contains all pricing logic for subscriptions and credit packs.
 */

import { FEATURE_COSTS } from './feature-costs';

export const PLANS = {
    starter: { price: 49, credits: 100, name: 'Starter' },
    pro: { price: 129, credits: 350, name: 'Pro' }
} as const

export type PlanKey = keyof typeof PLANS

export const CREDIT_PACKS = [
    { credits: 15, price: 10 },
    { credits: 80, price: 50 },
    { credits: 175, price: 100 },
    { credits: 450, price: 250 },
    { credits: 1000, price: 500, highlight: true },
    { credits: 2450, price: 1000 },
] as const

/**
 * Get price per credit based on volume
 */
export function getPricePerCredit(credits: number): number {
    if (credits < 15) return 1.00
    if (credits <= 80) return 0.63
    if (credits <= 175) return 0.58
    if (credits <= 450) return 0.55
    if (credits <= 1000) return 0.50
    if (credits <= 2450) return 0.42
    return 0.40
}

/**
 * Calculate price for a given number of credits
 */
export function calculatePrice(credits: number): number {
    return Math.round(credits * getPricePerCredit(credits))
}

/**
 * Convert SAR to USD (for PayPal)
 */
export function toUSD(sar: number): string {
    return (sar / 3.75).toFixed(2)
}

/**
 * Get credit value hint in Arabic
 * Shows users what they can do with their credits
 */
export function creditValueHint(credits: number): string {
    const cvs = Math.floor(credits / 15)
    const certs = Math.floor(credits / 15)
    const posts = Math.floor(credits / 3)
    return `≈ ${cvs} سيرة ذاتية · ${certs} شهادة · ${posts} منشور`
}

/**
 * Get plan by key
 */
export function getPlan(key: PlanKey) {
    return PLANS[key]
}

/**
 * Get all plans
 */
export function getAllPlans() {
    return PLANS
}

/**
 * Get all credit packs
 */
export function getAllCreditPacks() {
    return CREDIT_PACKS
}

/**
 * Calculate bulk certificate cost with volume discount
 *
 * Bulk discounts:
 * - 10-50 certificates: 5% discount
 * - 51-100 certificates: 10% discount
 * - 101-500 certificates: 15% discount
 * - 500+ certificates: 20% discount
 */
export function getBulkCertCost(count: number): number {
    const baseCost = FEATURE_COSTS.certificate_single * count;

    if (count >= 500) {
        return Math.round(baseCost * 0.8); // 20% discount
    } else if (count >= 101) {
        return Math.round(baseCost * 0.85); // 15% discount
    } else if (count >= 51) {
        return Math.round(baseCost * 0.9); // 10% discount
    } else if (count >= 10) {
        return Math.round(baseCost * 0.95); // 5% discount
    }

    return baseCost;
}
