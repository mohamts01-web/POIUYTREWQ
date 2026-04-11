/**
 * Unified Error Handling
 * 
 * This file provides a centralized way to handle errors
 * across the application with consistent responses.
 */

export const ERRORS = {
    INSUFFICIENT_CREDITS: {
        code: 'INSUFFICIENT_CREDITS',
        status: 402,
        message: 'رصيدك غير كافٍ',
        messageEn: 'Insufficient credits'
    },
    RATE_LIMIT_EXCEEDED: {
        code: 'RATE_LIMIT_EXCEEDED',
        status: 429,
        message: 'تجاوزت الحد المسموح',
        messageEn: 'Rate limit exceeded'
    },
    PDF_FAILED: {
        code: 'PDF_FAILED',
        status: 503,
        message: 'فشل في توليد PDF',
        messageEn: 'PDF generation failed'
    },
    INVALID_AI_RESPONSE: {
        code: 'INVALID_AI_RESPONSE',
        status: 500,
        message: 'استجابة الذكاء الاصطناعي غير صالحة',
        messageEn: 'Invalid AI response'
    },
    FEATURE_DISABLED: {
        code: 'FEATURE_DISABLED',
        status: 503,
        message: 'هذه الميزة غير متاحة حاليًا',
        messageEn: 'Feature disabled'
    },
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        status: 401,
        message: 'يجب تسجيل الدخول أولاً',
        messageEn: 'Unauthorized'
    },
    FORBIDDEN: {
        code: 'FORBIDDEN',
        status: 403,
        message: 'ليس لديك الصلاحية للوصول',
        messageEn: 'Forbidden'
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        status: 404,
        message: 'المورد غير موجود',
        messageEn: 'Not found'
    },
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        status: 400,
        message: 'بيانات غير صالحة',
        messageEn: 'Validation error'
    },
    INTERNAL_ERROR: {
        code: 'INTERNAL_ERROR',
        status: 500,
        message: 'حدث خطأ في الخادم',
        messageEn: 'Internal server error'
    },
} as const

export type ErrorKey = keyof typeof ERRORS

/**
 * Create a standardized error response
 * 
 * @param key - The error key from ERRORS object
 * @param extra - Additional error data (optional)
 * @returns Response object
 */
export function errorResponse(
    key: ErrorKey,
    extra: object = {}
): Response {
    const error = ERRORS[key]

    return Response.json({
        error: error.code,
        message: error.message,
        ...extra,
    }, { status: error.status })
}

/**
 * Create a success response
 * 
 * @param data - The data to return
 * @returns Response object
 */
export function successResponse(data: any): Response {
    return Response.json({
        success: true,
        data,
    })
}

/**
 * Check if an error is a specific type
 */
export function isError(error: any, key: ErrorKey): boolean {
    return error?.code === ERRORS[key].code
}

/**
 * Get error message for display
 */
export function getErrorMessage(error: any): string {
    if (error?.message) {
        return error.message
    }
    return ERRORS.INTERNAL_ERROR.message
}

/**
 * Log error for debugging
 */
export function logError(error: any, context: string = ''): void {
    console.error(`[${context}] Error:`, error)
}

/**
 * Handle API errors consistently
 */
export class AppError extends Error {
    code: string
    status: number
    constructor(key: ErrorKey, public message: string = ERRORS[key].message) {
        super(message)
        this.code = ERRORS[key].code
        this.status = ERRORS[key].status
        this.name = 'AppError'
    }
}

/**
 * Create an AppError instance
 */
export function createError(
    key: ErrorKey,
    message?: string
): AppError {
    return new AppError(key, message || ERRORS[key].message)
}
