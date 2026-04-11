/**
 * Feature Flags System
 * 
 * This file contains all feature flags for the CvSira platform.
 * Features can be enabled/disabled via environment variables.
 * 
 * Usage:
 *   if (!FEATURES.AI_IMAGE) return featureDisabledResponse()
 */

export const FEATURES = {
    AI_IMAGE: process.env.ENABLE_AI_IMAGE === 'true',
    BULK_CERTIFICATES: process.env.ENABLE_BULK_CERTIFICATES === 'true',
    JOB_ANALYSIS: process.env.ENABLE_JOB_ANALYSIS === 'true',
    SMART_UPSELL: process.env.ENABLE_SMART_UPSELL === 'true',
} as const

export type FeatureFlag = keyof typeof FEATURES

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
    return FEATURES[feature]
}

/**
 * Get all disabled features (for debugging)
 */
export function getDisabledFeatures(): FeatureFlag[] {
    return Object.entries(FEATURES)
        .filter(([_, enabled]) => !enabled)
        .map(([feature]) => feature as FeatureFlag)
}
