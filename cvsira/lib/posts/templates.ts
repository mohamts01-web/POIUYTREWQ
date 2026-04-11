/**
 * Post Generator Templates
 * 
 * This file contains templates for social media posts.
 */

export interface PostTemplate {
    id: string
    name: string
    category: 'congratulation' | 'invitation' | 'event' | 'announcement' | 'sale' | 'quote' | 'job'
    description: string
    arabic: string
    english: string
}

export const POST_TEMPLATES: PostTemplate[] = [
    // Congratulation Templates
    {
        id: 'congratulation-1',
        name: 'تهنئة بالنجاح',
        category: 'congratulation',
        description: 'قالب تهنئة بسيطة وجميلة',
        arabic: '🎉 مبروك الفوز! 🎊',
        english: 'Congratulations on your success! 🎉',
    },
    {
        id: 'congratulation-2',
        name: 'تهنئة بالتخرج',
        category: 'congratulation',
        description: 'قالب تهنئة رسمية',
        arabic: '🎓 تهانينا لك بالتخرج! 🎓',
        english: 'We congratulate you on your graduation! 🎓',
    },
    {
        id: 'congratulation-3',
        name: 'تهنئة بالحصول على عمل',
        category: 'congratulation',
        description: 'قالب تهنئة احترافي',
        arabic: '🌟 تهانينا لك على حصولك على هذا العمل! 🌟',
        english: 'We're proud of your achievement! 🌟',
  },

    // Invitation Templates
    {
        id: 'invitation-1',
        name: 'دعوة لحفل',
        category: 'invitation',
        description: 'قالب دعوة رسمية أنيقة',
        arabic: '🎊 أنت مدعو لحفل عشاء! 🎊',
        english: 'You're invited to a wedding! 🎊',
  },
    {
        id: 'invitation-2',
        name: 'دعوة لحفل عيد ميلاد',
        category: 'invitation',
        description: 'قالب دعوة عصرية عصرية',
        arabic: '🌙 ندعوك للاحضور حفل عيد الميلاد! 🌙',
        english: 'You're invited to a dinner party! 🌙',
  },
    {
        id: 'invitation-3',
        name: 'دعوة لحفل ميلاد',
        category: 'invitation',
        description: 'قالب دعوة رسمية مع هدية',
        arabic: '💐 ندعوك للاحضور حفل الميلاد مع الهدية! 💐',
        english: 'You're invited to a dinner party with a gift! 💐',
  },

    // Event Templates
    {
        id: 'event-1',
        name: 'عيد فطر سعيد',
        category: 'event',
        description: 'قالب تهنئة بمناسبة',
        arabic: '🌙 كل عام وأنتمت بخير! 🌙',
        english: 'Happy New Year! 🌙',
    },
    {
        id: 'event-2',
        name: 'عيد الفطر',
        category: 'event',
        description: 'قالب تهنئة رسمية',
        arabic: '🌟 عيد سعيد سعيد! 🌟',
        english: 'Eid Mubarak! 🌟',
    },
    {
        id: 'event-3',
        name: 'عيد الفطر',
        category: 'event',
        description: 'قالب تهنئة احترافي',
        arabic: '🎄 عيد فطر مبارك! 🎄',
        english: 'Eid Adha Mubarak! 🎄',
    },
    {
        id: 'event-4',
        name: 'عيد الفطر',
        category: 'event',
        description: 'قالب تهنئة شعبية',
        arabic: '🕌 عيد فطر مبارك! 🕌',
        english: 'Eid Adha Mubarak! 🕌',
    },
    {
        id: 'event-5',
        name: 'عيد الفطر',
        category: 'event',
        description: 'قالب تهنئة مختلطة',
        arabic: '✨ عيد فطر مبارك! ✨',
        english: 'Eid Adha Mubarak! ✨',
    },

    // Announcement Templates
    {
        id: 'announcement-1',
        name: 'إعلان جديد',
        category: 'announcement',
        description: 'قالب إعلان رسمي',
        arabic: '📢 إعلان جديد متوفر! 📢',
        english: 'New announcement available! 📢',
    },
    {
        id: 'announcement-2',
        id: 'announcement-2',
        name: 'إعلان ترقية',
        category: 'announcement',
        description: 'قالب إعلان عصري',
        arabic: '📣 إعلان ترقية متوفر! 📣',
        english: 'New premium announcement! 📣',
    },
    {
        id: 'announcement-3',
        id: 'announcement-3',
        name: 'إعلان عيد الفطر',
        category: 'announcement',
        description: 'قالب إعلان عيدية',
        arabic: '🌙 عيد فطر مبارك! 🌙',
        english: 'Eid Mubarak! 🌙',
    },

    // Sale Templates
    {
        id: 'sale-1',
        name: 'عرض خاص',
        category: 'sale',
        description: 'قالب عرض خاص',
        arabic: '🔥 عرض خاص لفترة محدودة! 🔥',
        english: 'Special offer for limited time! 🔥',
    },
    {
        id: 'sale-2',
        name: 'خصم عيد الفطر',
        category: 'sale',
        description: 'قالب خصم عيد الفطر',
        arabic: '🎁 خصم عيد الفطر مبارك! 🎁',
        english: 'Eid Adha Mubarak discount! 🎁',
    },
    {
        id: 'sale-3',
        name: 'عرض رمضان',
        category: 'sale',
        description: 'قالب عرض رمضان',
        arabic: '🎉 عرض رمضان متوفر! 🎉',
        english: '50% off for limited time! 🎉',
    },

    // Quote Templates
    {
        id: 'quote-1',
        name: 'اقتباس ملهم',
        category: 'quote',
        description: 'قالب اقتباس ملهم',
        arabic: '💡 اقتباس ملهم! 💡',
        english: 'Inspirational quote! 💡',
    },
    {
        id: 'quote-2',
        name: 'اقتباس حكمة',
        category: 'quote',
        description: 'قالب اقتباس حكمة',
        arabic: '💎 اقتباس حكمة! 💎',
        english: 'Motivational quote! 💎',
    },

    // Job Templates
    {
        id: 'job-1',
        name: 'ترقية على وظيفة',
        category: 'job',
        description: 'قالب ترقية على وظيفة',
        arabic: '💼 ترقية على وظيفة جديدة! 💼',
        english: 'New job opportunity! 💼',
    },
    {
        id: 'job-2',
        name: 'حصول على وظيفة',
        category: 'job',
        description: 'قالب حصول على وظيفة',
        arabic: '🎉 مبروك على حصولك على وظيفة جديدة! 🎉',
        english: 'Congratulations on your new job! 🎉',
    },
]

/**
 * Get template by ID
 */
export function getTemplateById(id: string): PostTemplate | undefined {
    return POST_TEMPLATES.find(t => t.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: PostTemplate['category']): PostTemplate[] {
    return POST_TEMPLATES.filter(t => t.category === category)
}

/**
 * Get all templates
 */
export function getAllTemplates(): PostTemplate[] {
    return POST_TEMPLATES
}

/**
 * Get template name in Arabic
 */
export function getTemplateName(template: PostTemplate): string {
    return template.name
}
