'use client';

import { useState, useMemo } from 'react';
import { CERTIFICATE_TEMPLATES, TemplateType, generateCertificateHTML, getTemplateById } from '@/lib/certificates/templates';

export default function CertificatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Certificate Form Data
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientEmail: '',
        courseName: '',
        courseDate: new Date().toISOString().split('T')[0],
        issuedDate: new Date().toISOString().split('T')[0],
        organizationName: '',
        instructorName: '',
    });

    const htmlPreview = useMemo(() => {
        return generateCertificateHTML({
            ...formData,
            template: selectedTemplate,
            certificateNumber: 'معاينة-فقط',
            verificationCode: 'معاينة-فقط',
        });
    }, [formData, selectedTemplate]);

    const handleGenerate = async () => {
        if (!formData.recipientName || !formData.courseName) {
            return alert('الرجاء إدخال اسم المتدرب واسم الدورة كحد أدنى.');
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/certificate/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplate,
                    data: formData
                })
            });

            const responseData = await res.json();
            
            if (res.ok && responseData.pdf_url) {
                alert('تم التوليد بنجاح! رمز التحقق: ' + responseData.verification_code);
                window.open(responseData.pdf_url, '_blank');
            } else {
                alert(responseData.error || 'فشل توليد الشهادة');
            }
        } catch (error) {
            alert('تعذر الاتصال بالخادم.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-slate-100">
            {/* Controls sidebar (35%) */}
            <div className="w-full md:w-[35%] bg-white border-l border-slate-200 overflow-y-auto p-6 flex flex-col gap-6 h-[calc(100vh-64px)] custom-scrollbar pb-24">
                
                <div>
                    <h2 className="text-xl font-bold mb-4 text-slate-800">1. اختيار القالب</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {CERTIFICATE_TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`p-3 border rounded-xl flex flex-col items-center justify-center transition-all ${
                                    selectedTemplate === t.id 
                                    ? 'border-brand-500 bg-brand-50 shadow-sm ring-2 ring-brand-200' 
                                    : 'border-slate-200 hover:border-brand-300'
                                }`}
                            >
                                <span className="font-bold text-slate-800 mb-1">{t.nameAr}</span>
                                <span className="text-xs text-slate-500">{t.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 text-slate-800">2. بيانات الشهادة</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">اسم المتدرب *</label>
                            <input 
                                type="text" 
                                className="w-full border p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={formData.recipientName}
                                onChange={e => setFormData({...formData, recipientName: e.target.value})}
                                placeholder="الاسم الكامل"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">البريد الإلكتروني للمتدرب</label>
                            <input 
                                type="email" 
                                className="w-full border p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={formData.recipientEmail}
                                onChange={e => setFormData({...formData, recipientEmail: e.target.value})}
                                placeholder="اختياري (لإرسال الشهادة)"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">اسم الدورة/الحدث *</label>
                            <input 
                                type="text" 
                                className="w-full border p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={formData.courseName}
                                onChange={e => setFormData({...formData, courseName: e.target.value})}
                                placeholder="مثال: دورة التسويق الرقمي"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">الجهة المُصدرة</label>
                                <input 
                                    type="text" 
                                    className="w-full border p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.organizationName}
                                    onChange={e => setFormData({...formData, organizationName: e.target.value})}
                                    placeholder="اسم مؤسستك"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">اسم المدرب/المدير</label>
                                <input 
                                    type="text" 
                                    className="w-full border p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.instructorName}
                                    onChange={e => setFormData({...formData, instructorName: e.target.value})}
                                    placeholder="اختياري"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ الدورة</label>
                                <input 
                                    type="date" 
                                    className="w-full border p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.courseDate}
                                    onChange={e => setFormData({...formData, courseDate: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ الإصدار</label>
                                <input 
                                    type="date" 
                                    className="w-full border p-2.5 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={formData.issuedDate}
                                    onChange={e => setFormData({...formData, issuedDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition flex items-center justify-center gap-2 text-lg shadow-md disabled:opacity-50"
                    >
                        {isGenerating ? 'جاري المعالجة وتوليد PDF...' : 'إصدار الشهادة (15 نقطة)'}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-2">
                        سيتضمن الإصدار رفع النسخة الأصلية، وتكوين رمز فحص إلكتروني QR.
                    </p>
                </div>
            </div>

            {/* Preview (65%) */}
            <div className="w-full md:w-[65%] bg-slate-800 p-8 flex items-center justify-center h-[calc(100vh-64px)] overflow-auto relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-700 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

                <div className="w-[850px] max-w-full bg-white shadow-2xl rounded-sm transition-all duration-300 transform scale-90 lg:scale-100" style={{ height: '600px' }}>
                    <iframe 
                        srcDoc={htmlPreview}
                        className="w-full h-full border-0 pointer-events-none"
                        title="Certificate Preview"
                    />
                </div>
            </div>
        </div>
    );
}
