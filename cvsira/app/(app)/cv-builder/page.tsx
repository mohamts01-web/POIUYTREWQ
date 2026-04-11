'use client';

import { useState, useMemo } from 'react';
import { CV, defaultCV, Theme, Font, getTheme, getFont } from '@/lib/cv/schema';
import { renderCV } from '@/lib/cv/renderCV';

export default function CVBuilderPage() {
    const [cv, setCv] = useState<CV>(defaultCV);
    const [themeName, setThemeName] = useState('classic');
    const [fontName, setFontName] = useState('cairo');
    const [jobDescription, setJobDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Compute HTML for the iframe preview
    const htmlPreview = useMemo(() => {
        const theme = getTheme(themeName);
        const font = getFont(fontName);
        return renderCV(cv.template, cv, theme, font);
    }, [cv, themeName, fontName]);

    const handleAIGenerate = async () => {
        if (!jobDescription) {
            alert('يرجى إدخال المسمى الوظيفي أو الوصف الوظيفي أولاً');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/cv/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription, userData: cv })
            });
            const data = await res.json();
            
            if (res.ok && data.cv) {
                setCv(prev => ({ ...prev, ...data.cv }));
                alert('تم التوليد بنجاح!');
            } else {
                alert(data.error || 'حدث خطأ أثناء التوليد');
            }
        } catch (e: any) {
            alert('تعذر الاتصال بالخادم.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // Need to know trial status, practically we fetch wallet first but assuming not trial for safety if unknown or fetching it.
            // Simplified for prototype:
            const trialUsed = true; // Replace with actual check
            
            const res = await fetch('/api/cv/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html: htmlPreview, cvId: null, trialUsed })
            });
            
            const data = await res.json();
            if (res.ok && data.pdf_url) {
                window.open(data.pdf_url, '_blank');
            } else {
                alert(data.error || 'فشل التصدير');
            }
        } catch (e) {
            alert('تعذر التصدير');
        } finally {
            setIsDownloading(false);
        }
    };

    const updatePersonalInfo = (field: string, value: string) => {
        setCv(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-slate-100">
            {/* Controls sidebar (35%) */}
            <div className="w-full md:w-[35%] bg-white border-l border-slate-200 overflow-y-auto p-6 flex flex-col gap-8 h-[calc(100vh-64px)] custom-scrollbar pb-24">
                
                <div>
                    <h2 className="text-xl font-bold mb-4 text-slate-800">1. التصميم والاستايل</h2>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <select 
                            className="border p-2 rounded bg-slate-50 text-sm"
                            value={cv.template}
                            onChange={(e) => setCv({...cv, template: e.target.value as any})}
                        >
                            <option value="classic">كلاسيكي</option>
                            <option value="modern">عصري</option>
                            <option value="hybrid">هجين</option>
                        </select>
                        <select 
                            className="border p-2 rounded bg-slate-50 text-sm"
                            value={fontName}
                            onChange={(e) => setFontName(e.target.value)}
                        >
                            <option value="cairo">Cairo</option>
                            <option value="tajawal">Tajawal</option>
                        </select>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 text-slate-800">2. البيانات الشخصية</h2>
                    <div className="space-y-3">
                        <input className="w-full border p-2 rounded bg-slate-50 text-sm" placeholder="الاسم الكامل" value={cv.personalInfo.name} onChange={e => updatePersonalInfo('name', e.target.value)} />
                        <input className="w-full border p-2 rounded bg-slate-50 text-sm" placeholder="المسمى المهني (مثل مهندس، محاسب...)" value={cv.personalInfo.title} onChange={e => updatePersonalInfo('title', e.target.value)} />
                        <input className="w-full border p-2 rounded bg-slate-50 text-sm" placeholder="البريد الإلكتروني" value={cv.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} dir="ltr" />
                        <input className="w-full border p-2 rounded bg-slate-50 text-sm" placeholder="رقم الهاتف" value={cv.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} dir="ltr" />
                        <input className="w-full border p-2 rounded bg-slate-50 text-sm" placeholder="المدينة، الدولة" value={cv.personalInfo.address} onChange={e => updatePersonalInfo('address', e.target.value)} />
                    </div>
                </div>

                {/* --- Skills --- */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">3. المهارات</h2>
                        <button 
                            onClick={() => setCv(prev => ({...prev, skills: [...prev.skills, '']}))}
                            className="bg-brand-100 text-brand-700 px-3 py-1 rounded text-sm hover:bg-brand-200"
                        >+ إضافة مهارة</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {cv.skills.map((skill, index) => (
                            <div key={index} className="flex gap-1 items-center">
                                <input 
                                    className="border p-2 rounded bg-slate-50 text-sm w-32" 
                                    value={skill} 
                                    onChange={e => {
                                        const newSkills = [...cv.skills];
                                        newSkills[index] = e.target.value;
                                        setCv(prev => ({...prev, skills: newSkills}));
                                    }} 
                                />
                                <button onClick={() => {
                                    const newSkills = cv.skills.filter((_, i) => i !== index);
                                    setCv(prev => ({...prev, skills: newSkills}));
                                }} className="text-red-500 rounded-full hover:bg-red-50 p-1">×</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Experience --- */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">4. الخبرات</h2>
                        <button 
                            onClick={() => setCv(prev => ({...prev, experience: [...prev.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]}))}
                            className="bg-brand-100 text-brand-700 px-3 py-1 rounded text-sm hover:bg-brand-200"
                        >+ إضافة خبرة</button>
                    </div>
                    <div className="space-y-4">
                        {cv.experience.map((exp, index) => (
                            <div key={index} className="border p-3 rounded-xl bg-slate-50 space-y-2 relative">
                                <button onClick={() => {
                                    const newExp = cv.experience.filter((_, i) => i !== index);
                                    setCv(prev => ({...prev, experience: newExp}));
                                }} className="absolute top-2 left-2 text-red-500 hover:bg-red-50 px-2 rounded">حذف</button>
                                <input className="w-full border p-2 rounded bg-white text-sm" placeholder="المسمى الوظيفي" value={exp.title} onChange={e => {
                                    const newExp = [...cv.experience]; newExp[index].title = e.target.value; setCv(prev => ({...prev, experience: newExp}));
                                }} />
                                <input className="w-full border p-2 rounded bg-white text-sm" placeholder="جهة العمل / الشركة" value={exp.company} onChange={e => {
                                    const newExp = [...cv.experience]; newExp[index].company = e.target.value; setCv(prev => ({...prev, experience: newExp}));
                                }} />
                                <div className="flex gap-2">
                                    <input className="w-1/2 border p-2 rounded bg-white text-sm" placeholder="من (مثال: 2020)" value={exp.startDate} onChange={e => {
                                        const newExp = [...cv.experience]; newExp[index].startDate = e.target.value; setCv(prev => ({...prev, experience: newExp}));
                                    }} />
                                    <input className="w-1/2 border p-2 rounded bg-white text-sm" placeholder="إلى (مثال: الآن)" value={exp.endDate} onChange={e => {
                                        const newExp = [...cv.experience]; newExp[index].endDate = e.target.value; setCv(prev => ({...prev, experience: newExp}));
                                    }} />
                                </div>
                                <textarea className="w-full border p-2 rounded bg-white text-sm" placeholder="وصف المهام..." value={exp.description} onChange={e => {
                                    const newExp = [...cv.experience]; newExp[index].description = e.target.value; setCv(prev => ({...prev, experience: newExp}));
                                }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Education --- */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">5. التعليم</h2>
                        <button 
                            onClick={() => setCv(prev => ({...prev, education: [...prev.education, { degree: '', school: '', field: '', year: '' }]}))}
                            className="bg-brand-100 text-brand-700 px-3 py-1 rounded text-sm hover:bg-brand-200"
                        >+ إضافة تعليم</button>
                    </div>
                    <div className="space-y-4">
                        {cv.education.map((edu, index) => (
                            <div key={index} className="border p-3 rounded-xl bg-slate-50 space-y-2 relative">
                                <button onClick={() => {
                                    const newEdu = cv.education.filter((_, i) => i !== index);
                                    setCv(prev => ({...prev, education: newEdu}));
                                }} className="absolute top-2 left-2 text-red-500 hover:bg-red-50 px-2 rounded">حذف</button>
                                <input className="w-full border p-2 rounded bg-white text-sm" placeholder="الدرجة العلمية (مثال: بكالوريوس)" value={edu.degree} onChange={e => {
                                    const newEdu = [...cv.education]; newEdu[index].degree = e.target.value; setCv(prev => ({...prev, education: newEdu}));
                                }} />
                                <input className="w-full border p-2 rounded bg-white text-sm" placeholder="الجامعة / المؤسسة" value={edu.school} onChange={e => {
                                    const newEdu = [...cv.education]; newEdu[index].school = e.target.value; setCv(prev => ({...prev, education: newEdu}));
                                }} />
                                <input className="w-full border p-2 rounded bg-white text-sm" placeholder="التخصص" value={edu.field} onChange={e => {
                                    const newEdu = [...cv.education]; newEdu[index].field = e.target.value; setCv(prev => ({...prev, education: newEdu}));
                                }} />
                                <input className="w-full border p-2 rounded bg-white text-sm" placeholder="سنة التخرج" value={edu.year} onChange={e => {
                                    const newEdu = [...cv.education]; newEdu[index].year = e.target.value; setCv(prev => ({...prev, education: newEdu}));
                                }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-brand-50 p-4 border border-brand-200 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500 rounded-full blur-[30px] opacity-20"></div>
                    <h2 className="text-lg font-bold mb-2 text-brand-900 flex items-center gap-2">
                        <span>✨</span> توليد بالذكاء الاصطناعي
                    </h2>
                    <p className="text-sm text-brand-700 mb-3">
                        اكتب المسمى الوظيفي وسنقوم بتوليد النقاط القوية والكلمات المفتاحية!
                    </p>
                    <textarea 
                        className="w-full border border-brand-200 p-2 rounded bg-white text-sm mb-3 min-h-[80px]"
                        placeholder="الصق الوصف الوظيفي (Job Description) للحصول على أفضل تطابق..."
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                    />
                    <button 
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        className="w-full bg-brand-600 text-white font-bold py-2 rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                    >
                        {isGenerating ? 'جاري السحر...' : 'توليد المحتوى (10 نقاط)'}
                    </button>
                </div>
                
                <div className="mt-8 border-t pt-6">
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-2 text-lg shadow-lg"
                    >
                        {isDownloading ? 'جاري التحميل...' : 'تصدير PDF (5 نقاط)'}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-2">السعر: 5 نقاط للسحب المستند</p>
                </div>
            </div>

            {/* Preview (65%) */}
            <div className="w-full md:w-[65%] bg-slate-200 p-8 flex items-start justify-center h-[calc(100vh-64px)] overflow-y-auto">
                <div className="w-[210mm] max-w-full bg-white shadow-2xl rounded" style={{ height: '297mm', transform: 'scale(1)', transformOrigin: 'top center' }}>
                    <iframe 
                        srcDoc={htmlPreview}
                        className="w-full h-full border-0 pointer-events-none"
                        title="CV Preview"
                    />
                </div>
            </div>
        </div>
    );
}
