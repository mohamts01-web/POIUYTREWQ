/**
 * Feature Cost Configuration
 * 
 * This file contains the cost (in credits) for each feature in the platform.
 * This is the single source of truth for feature pricing.
 * 
 * To change prices, modify the values in this file only.
 * No need to touch any feature code.
 */

export const FEATURE_COSTS = {
    // CV Builder
    cv_generate: 10,
    cv_regenerate_section: 1,
    cv_pdf_download: 5,
    cv_pdf_trial: 1,

    // Post Generator
    post_draft: 2,
    post_ai_text: 1,
    post_ai_image_1k: 1,
    post_ai_image_2k: 2,

    // Certificate Engine
    certificate_single: 15,
    certificate_bulk_mid: 12,  // 10–50
    certificate_bulk_high: 8,  // 50+
} as const

export type FeatureKey = keyof typeof FEATURE_COSTS

/**
 * Get the cost for a specific feature
 */
export function getCost(feature: FeatureKey): number {
    return FEATURE_COSTS[feature]
}

/**
 * Calculate bulk certificate cost with volume discounts
 * @param count - Number of certificates to generate
 * @returns Total credits required
 */
export function getBulkCertCost(count: number): number {
    if (count <= 10) {
        return FEATURE_COSTS.certificate_single * count
    }
    if (count <= 50) {
        return FEATURE_COSTS.certificate_bulk_mid * count
    }
    return FEATURE_COSTS.certificate_bulk_high * count
}

/**
 * Get all feature costs (for display purposes)
 */
export function getAllFeatureCosts() {
    return FEATURE_COSTS
}
