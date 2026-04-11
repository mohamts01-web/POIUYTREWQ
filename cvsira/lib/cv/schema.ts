/**
 * CV Schema
 * 
 * This file defines the TypeScript types for CV data structures.
 */

export type PersonalInfo = {
    name: string
    title: string
    email: string
    phone: string
    address: string
}

export type Experience = {
    title: string
    company: string
    startDate: string
    endDate: string
    description: string
}

export type Education = {
    degree: string
    school: string
    field: string
    year: string
}

export type CV = {
    personalInfo: PersonalInfo
    summary: string
    skills: string[]
    experience: Experience[]
    education: Education[]
    template: TemplateType
}

export type Theme = {
    primary: string
    text: string
}

export type Font = {
    family: 'Cairo' | 'Tajawal' | 'Inter' | 'Amiri'
    direction: 'rtl' | 'ltr'
}

export type TemplateType = 'classic' | 'modern' | 'hybrid'


/**
 * Default empty CV template
 */
export const defaultCV: CV = {
    personalInfo: {
        name: '',
        title: '',
        email: '',
        phone: '',
        address: '',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    template: 'classic' as TemplateType,
}

/**
 * Default themes
 */
export const DEFAULT_THEMES: Record<string, Theme> = {
    classic: {
        primary: '#2563eb',
        text: '#1f2937',
    },
    modern: {
        primary: '#0891b2',
        text: '#1f2937',
    },
    hybrid: {
        primary: '#7c3aed',
        text: '#1f2937',
    },
}

/**
 * Default fonts
 */
export const DEFAULT_FONTS: Record<string, Font> = {
    cairo: {
        family: 'Cairo',
        direction: 'rtl',
    },
    tajawal: {
        family: 'Tajawal',
        direction: 'rtl',
    },
    inter: {
        family: 'Inter',
        direction: 'ltr',
    },
    amiri: {
        family: 'Amiri',
        direction: 'rtl',
    },
}

/**
 * Get theme by name
 */
export function getTheme(name: string): Theme {
    return DEFAULT_THEMES[name] || DEFAULT_THEMES.classic
}

/**
 * Get font by name
 */
export function getFont(name: string): Font {
    return DEFAULT_FONTS[name] || DEFAULT_FONTS.cairo
}

/**
 * Validate CV data
 */
export function validateCV(cv: CV): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!cv.personalInfo.name) errors.push('الاسم مطلوب')
    if (!cv.personalInfo.email) errors.push('البريد الإلكتروني مطلوب')
    if (!cv.personalInfo.phone) errors.push('رقم الهاتف مطلوب')
    if (!cv.summary) errors.push('الملخص مطلوب')
    if (cv.skills.length === 0) errors.push('يجب إضافة مهارة واحدة على الأقل')
    if (cv.experience.length === 0) errors.push('يجب إضافة خبرة واحدة على الأقل')

    return {
        valid: errors.length === 0,
        errors,
    }
}
