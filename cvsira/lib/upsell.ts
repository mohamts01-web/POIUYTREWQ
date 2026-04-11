/**
 * Smart Upsell Engine
 * 
 * This file provides intelligent upsell suggestions based on user behavior.
 * It analyzes usage patterns and suggests relevant upgrades.
 */

import { PLANS } from './pricing'

export interface UpsellSuggestion {
    message: string
    cta: string
    href: string
}

interface UsageStats {
    cv: number
    post: number
    cert: number
}

/**
 * Get upsell suggestion based on user behavior
 * 
 * @param usage - User's usage statistics
 * @param plan - Current subscription plan
 * @param balance - Current credit balance
 * @returns Upsell suggestion or null
 */
export function getUpsellSuggestion(
    usage: UsageStats,
    plan: string,
    balance: number
): UpsellSuggestion | null {
    // If user uses CV Builder heavily → suggest Pro
    if (usage.cv > 80 && plan === 'free') {
        return {
            message: 'أنت تستخدم CV Builder كثيرًا 🎯 وفّر مع Pro',
            cta: 'ترقية لـ Pro — 129 SAR',
            href: '/payment?tab=subscription',
        }
    }

    // If user uses Certificates heavily → suggest Bulk Pack
    if (usage.cert > 100) {
        return {
            message: 'توليد جماعي بسعر أقل — وفّر حتى 47%',
            cta: 'شراء 1000 Credits',
            href: '/payment?credits=1000',
        }
    }

    // If user hasn't tried a product → encourage them
    if (usage.cv === 0) {
        return {
            message: 'لم تجرب CV Builder بعد 📄',
            cta: 'جرّبه الآن — مجانًا',
            href: '/cv-builder',
        }
    }

    if (usage.post === 0) {
        return {
            message: 'لم تجرب Post Generator بعد 📱',
            cta: 'جرّبه الآن — مجانًا',
            href: '/post-generator',
        }
    }

    if (usage.cert === 0) {
        return {
            message: 'لم تجرب Certificate Engine بعد 🏆',
            cta: 'جرّبه الآن — مجانًا',
            href: '/certificates',
        }
    }

    // Low balance warning
    if (balance < 15) {
        return {
            message: `رصيدك ${balance} credits فقط`,
            cta: 'شحن 80 Credits — 50 SAR',
            href: '/payment?credits=80',
        }
    }

    // Medium balance warning
    if (balance < 30) {
        return {
            message: `رصيدك ${balance} credits`,
            cta: 'شحن 175 Credits — 100 SAR',
            href: '/payment?credits=175',
        }
    }

    // No suggestion needed
    return null
}

/**
 * Get all available upsell suggestions
 * (for debugging or A/B testing)
 */
export function getAllUpsellSuggestions(
    usage: UsageStats,
    plan: string,
    balance: number
): UpsellSuggestion[] {
    const suggestions: UpsellSuggestion[] = []

    const cvSuggestion = getUpsellSuggestion(usage, plan, balance)
    if (cvSuggestion) suggestions.push(cvSuggestion)

    const postSuggestion = getUpsellSuggestion(
        { ...usage, cv: 0 },
        plan,
        balance
    )
    if (postSuggestion) suggestions.push(postSuggestion)

    const certSuggestion = getUpsellSuggestion(
        { ...usage, cv: 0, post: 0 },
        plan,
        balance
    )
    if (certSuggestion) suggestions.push(certSuggestion)

    return suggestions
}

/**
 * Get plan upgrade suggestion
 */
export function getPlanUpgradeSuggestion(
    currentPlan: string,
    usage: UsageStats
): UpsellSuggestion | null {
    if (currentPlan === 'free') {
        // Check total usage
        const totalUsage = usage.cv + usage.post + usage.cert

        if (totalUsage > 100) {
            return {
                message: 'استهلاكك مرتفع — Pro مناسب لك 💎',
                cta: 'ترقية لـ Pro — 129 SAR/شهر',
                href: '/payment?plan=pro',
            }
        }

        if (totalUsage > 50) {
            return {
                message: 'ابدأ في الاستخدام — جرّب Starter',
                cta: 'اشتراك Starter — 49 SAR/شهر',
                href: '/payment?plan=starter',
            }
        }
    }

    return null
}

/**
 * Get credit pack suggestion based on usage
 */
export function getCreditPackSuggestion(
    usage: UsageStats,
    balance: number
): UpsellSuggestion | null {
    // If user uses mostly CVs → suggest medium pack
    if (usage.cv > usage.post && usage.cv > usage.cert) {
        if (balance < 50) {
            return {
                message: 'أنت تستخدم CV Builder بكثرة',
                cta: 'حزمة 450 Credits — 250 SAR',
                href: '/payment?credits=450',
            }
        }
    }

    // If user uses Certificates heavily → suggest large pack
    if (usage.cert > 50) {
        if (balance < 100) {
            return {
                message: 'أنت تستخدم Certificate Engine بكثرة',
                cta: 'حزمة 1000 Credits ⭐ — 500 SAR',
                href: '/payment?credits=1000',
            }
        }
    }

    return null
}
