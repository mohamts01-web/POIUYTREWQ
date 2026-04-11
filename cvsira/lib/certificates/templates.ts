/**
 * Certificate Templates System
 * 
 * Defines available certificate templates with their metadata and HTML generators
 */

export type TemplateType = 'modern' | 'classic' | 'elegant' | 'minimal';

export interface CertificateTemplate {
    id: TemplateType;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    preview: string;
    colors: string[];
}

export const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
    {
        id: 'modern',
        name: 'Modern',
        nameAr: 'حديث',
        description: 'Clean and contemporary design with blue accents',
        descriptionAr: 'تصميم عصري ونظيف مع لمسات زرقاء',
        preview: '/certificates/modern-preview.png',
        colors: ['#2563eb', '#1e40af', '#3b82f6'],
    },
    {
        id: 'classic',
        name: 'Classic',
        nameAr: 'كلاسيكي',
        description: 'Traditional elegant design with serif fonts',
        descriptionAr: 'تصميم تقليدي أنيق بخطوط Serif',
        preview: '/certificates/classic-preview.png',
        colors: ['#1e293b', '#334155', '#475569'],
    },
    {
        id: 'elegant',
        name: 'Elegant',
        nameAr: 'أنيق',
        description: 'Sophisticated design with gold accents',
        descriptionAr: 'تصميم متطور مع لمسات ذهبية',
        preview: '/certificates/elegant-preview.png',
        colors: ['#b8860b', '#daa520', '#ffd700'],
    },
    {
        id: 'minimal',
        name: 'Minimal',
        nameAr: 'بسيط',
        description: 'Simple and clean design for modern certificates',
        descriptionAr: 'تصميم بسيط ونظيف للشهادات الحديثة',
        preview: '/certificates/minimal-preview.png',
        colors: ['#64748b', '#94a3b8', '#cbd5e1'],
    },
];

export interface CertificateData {
    recipientName: string;
    recipientEmail: string;
    courseName: string;
    courseDate: string;
    template: TemplateType;
    issuedDate: string;
    organizationName?: string;
    organizationLogo?: string;
    instructorName?: string;
    certificateNumber?: string;
    verificationCode?: string;
}

/**
 * Generate certificate HTML based on template
 */
export function generateCertificateHTML(data: CertificateData): string {
    const templates = {
        modern: generateModernTemplate,
        classic: generateClassicTemplate,
        elegant: generateElegantTemplate,
        minimal: generateMinimalTemplate,
    };

    const generator = templates[data.template] || generateModernTemplate;
    return generator(data);
}

/**
 * Modern Template
 */
function generateModernTemplate(data: CertificateData): string {
    const { recipientName, recipientEmail, courseName, courseDate, issuedDate, organizationName, instructorName, certificateNumber, verificationCode } = data;
    const formattedDate = new Date(courseDate).toLocaleDateString('ar-SA');
    const formattedIssuedDate = new Date(issuedDate).toLocaleDateString('ar-SA');

    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>شهادة إتمام دورة - ${courseName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
    body { font-family: 'Tajawal', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .certificate { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border: 3px solid #2563eb; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
    .title { font-size: 32px; font-weight: 700; color: #2563eb; margin-bottom: 5px; }
    .subtitle { font-size: 18px; color: #64748b; }
    .content { margin: 30px 0; }
    .field { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
    .label { font-weight: 700; color: #64748b; font-size: 16px; margin-bottom: 5px; }
    .value { font-size: 18px; color: #1e293b; font-weight: 500; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .signature { font-style: italic; color: #64748b; margin-top: 10px; }
    .verification { margin-top: 20px; padding: 10px; background: #ecfdf5; border-radius: 5px; color: #059669; font-size: 14px; }
    .certificate-number { font-size: 12px; color: #94a3b8; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="title">شهادة إتمام دورة</div>
      <div class="subtitle">Certificate of Completion</div>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">تشهد إلى:</div>
        <div class="value">${recipientName}</div>
        <div style="font-size: 14px; color: #94a3b8; margin-top: 5px;">${recipientEmail}</div>
      </div>
      <div class="field">
        <div class="label">اسم الدورة:</div>
        <div class="value">${courseName}</div>
      </div>
      ${organizationName ? `
      <div class="field">
        <div class="label">المؤسسة:</div>
        <div class="value">${organizationName}</div>
      </div>
      ` : ''}
      ${instructorName ? `
      <div class="field">
        <div class="label">المدرب:</div>
        <div class="value">${instructorName}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">تاريخ إتمام الدورة:</div>
        <div class="value">${formattedDate}</div>
      </div>
    </div>
    <div class="footer">
      <div class="signature">تم إصدار هذه الشهادة بناءً على إتمام المتطلبات</div>
      <div>تاريخ الإصدار: ${formattedIssuedDate}</div>
      ${verificationCode ? `
      <div class="verification">رمز التحقق: ${verificationCode}</div>
      ` : ''}
      ${certificateNumber ? `
      <div class="certificate-number">رقم الشهادة: ${certificateNumber}</div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Classic Template
 */
function generateClassicTemplate(data: CertificateData): string {
    const { recipientName, recipientEmail, courseName, courseDate, issuedDate, organizationName, certificateNumber, verificationCode } = data;
    const formattedDate = new Date(courseDate).toLocaleDateString('ar-SA');
    const formattedIssuedDate = new Date(issuedDate).toLocaleDateString('ar-SA');

    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>شهادة - ${courseName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
    body { font-family: 'Amiri', serif; margin: 0; padding: 20px; background: #fafafa; }
    .certificate { max-width: 800px; margin: 0 auto; background: #fff; padding: 50px; border: 5px double #1e293b; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e293b; padding-bottom: 20px; }
    .title { font-size: 36px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
    .subtitle { font-size: 20px; color: #64748b; }
    .content { margin: 40px 0; }
    .field { margin-bottom: 25px; }
    .label { font-weight: 700; color: #475569; font-size: 18px; margin-bottom: 8px; }
    .value { font-size: 20px; color: #1e293b; }
    .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #1e293b; }
    .verification { margin-top: 20px; padding: 10px; background: #f1f5f9; border-radius: 5px; color: #475569; font-size: 14px; }
    .certificate-number { font-size: 12px; color: #94a3b8; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="title">شهادة إتمام دورة</div>
      <div class="subtitle">Certificate of Completion</div>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">تشهد إلى:</div>
        <div class="value">${recipientName}</div>
        <div style="font-size: 14px; color: #94a3b8; margin-top: 5px;">${recipientEmail}</div>
      </div>
      ${organizationName ? `
      <div class="field">
        <div class="label">المؤسسة:</div>
        <div class="value">${organizationName}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">اسم الدورة:</div>
        <div class="value">${courseName}</div>
      </div>
      <div class="field">
        <div class="label">تاريخ إتمام الدورة:</div>
        <div class="value">${formattedDate}</div>
      </div>
    </div>
    <div class="footer">
      <div>تم إصدار هذه الشهادة بناءً على إتمام المتطلبات</div>
      <div>تاريخ الإصدار: ${formattedIssuedDate}</div>
      ${verificationCode ? `
      <div class="verification">رمز التحقق: ${verificationCode}</div>
      ` : ''}
      ${certificateNumber ? `
      <div class="certificate-number">رقم الشهادة: ${certificateNumber}</div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Elegant Template
 */
function generateElegantTemplate(data: CertificateData): string {
    const { recipientName, recipientEmail, courseName, courseDate, issuedDate, organizationName, instructorName, certificateNumber, verificationCode } = data;
    const formattedDate = new Date(courseDate).toLocaleDateString('ar-SA');
    const formattedIssuedDate = new Date(issuedDate).toLocaleDateString('ar-SA');

    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>شهادة إتمام دورة - ${courseName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Tajawal:wght@400;500;700&display=swap');
    body { font-family: 'Tajawal', sans-serif; margin: 0; padding: 20px; background: #faf9f7; }
    .certificate { max-width: 800px; margin: 0 auto; background: white; padding: 50px; border: 4px solid #b8860b; border-radius: 15px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #b8860b 0%, #daa520 100%); color: white; padding: 20px; border-radius: 10px; }
    .title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; margin-bottom: 5px; }
    .subtitle { font-size: 18px; opacity: 0.9; }
    .content { margin: 40px 0; }
    .field { margin-bottom: 25px; padding: 15px; border-right: 4px solid #b8860b; background: #faf9f7; }
    .label { font-weight: 700; color: #b8860b; font-size: 16px; margin-bottom: 8px; }
    .value { font-size: 18px; color: #1e293b; }
    .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #b8860b; }
    .signature { font-style: italic; color: #64748b; margin-top: 10px; }
    .verification { margin-top: 20px; padding: 10px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 5px; color: #92400e; font-size: 14px; }
    .certificate-number { font-size: 12px; color: #94a3b8; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="title">شهادة إتمام دورة</div>
      <div class="subtitle">Certificate of Completion</div>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">تشهد إلى:</div>
        <div class="value">${recipientName}</div>
        <div style="font-size: 14px; color: #94a3b8; margin-top: 5px;">${recipientEmail}</div>
      </div>
      ${organizationName ? `
      <div class="field">
        <div class="label">المؤسسة:</div>
        <div class="value">${organizationName}</div>
      </div>
      ` : ''}
      ${instructorName ? `
      <div class="field">
        <div class="label">المدرب:</div>
        <div class="value">${instructorName}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">اسم الدورة:</div>
        <div class="value">${courseName}</div>
      </div>
      <div class="field">
        <div class="label">تاريخ إتمام الدورة:</div>
        <div class="value">${formattedDate}</div>
      </div>
    </div>
    <div class="footer">
      <div class="signature">تم إصدار هذه الشهادة بناءً على إتمام المتطلبات</div>
      <div>تاريخ الإصدار: ${formattedIssuedDate}</div>
      ${verificationCode ? `
      <div class="verification">رمز التحقق: ${verificationCode}</div>
      ` : ''}
      ${certificateNumber ? `
      <div class="certificate-number">رقم الشهادة: ${certificateNumber}</div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Minimal Template
 */
function generateMinimalTemplate(data: CertificateData): string {
    const { recipientName, recipientEmail, courseName, courseDate, issuedDate, certificateNumber, verificationCode } = data;
    const formattedDate = new Date(courseDate).toLocaleDateString('ar-SA');
    const formattedIssuedDate = new Date(issuedDate).toLocaleDateString('ar-SA');

    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>شهادة إتمام دورة - ${courseName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
    .certificate { max-width: 800px; margin: 0 auto; background: white; padding: 60px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 50px; }
    .title { font-size: 24px; font-weight: 300; color: #1e293b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
    .subtitle { font-size: 14px; color: #94a3b8; letter-spacing: 1px; }
    .content { margin: 50px 0; }
    .field { margin-bottom: 30px; }
    .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .value { font-size: 18px; color: #1e293b; font-weight: 300; }
    .footer { text-align: center; margin-top: 60px; padding-top: 30px; border-top: 1px solid #f1f5f9; }
    .verification { margin-top: 20px; padding: 10px; background: #f8fafc; border-radius: 5px; color: #64748b; font-size: 12px; letter-spacing: 0.5px; }
    .certificate-number { font-size: 10px; color: #cbd5e1; margin-top: 10px; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="title">شهادة إتمام دورة</div>
      <div class="subtitle">Certificate of Completion</div>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">تشهد إلى</div>
        <div class="value">${recipientName}</div>
        <div style="font-size: 12px; color: #cbd5e1; margin-top: 5px;">${recipientEmail}</div>
      </div>
      <div class="field">
        <div class="label">اسم الدورة</div>
        <div class="value">${courseName}</div>
      </div>
      <div class="field">
        <div class="label">تاريخ إتمام الدورة</div>
        <div class="value">${formattedDate}</div>
      </div>
    </div>
    <div class="footer">
      <div style="font-size: 14px; color: #94a3b8;">تم إصدار هذه الشهادة بناءً على إتمام المتطلبات</div>
      <div style="font-size: 12px; color: #cbd5e1; margin-top: 10px;">تاريخ الإصدار: ${formattedIssuedDate}</div>
      ${verificationCode ? `
      <div class="verification">رمز التحقق: ${verificationCode}</div>
      ` : ''}
      ${certificateNumber ? `
      <div class="certificate-number">رقم الشهادة: ${certificateNumber}</div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): CertificateTemplate | undefined {
    return CERTIFICATE_TEMPLATES.find(t => t.id === id);
}

/**
 * Get all templates
 */
export function getAllTemplates(): CertificateTemplate[] {
    return CERTIFICATE_TEMPLATES;
}
