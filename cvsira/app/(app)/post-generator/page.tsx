'use client';

import { useState, useRef } from 'react';
import { POST_TEMPLATES, PostTemplate } from '@/lib/posts/templates';
import * as htmlToImage from 'html-to-image';
import { Button } from '@/components/ui/button';

export default function PostGeneratorPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate>(POST_TEMPLATES[0]);
    const [name, setName] = useState('');
    const [context, setContext] = useState('');
    const [variations, setVariations] = useState<string[]>([]);
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    
    // Live text that the user selects or edits
    const [activeText, setActiveText] = useState(POST_TEMPLATES[0].arabic);
    
    const postRef = useRef<HTMLDivElement>(null);

    const handleGenerateText = async () => {
        if (!name) return alert('الرجاء إدخال الاسم أو محور المنشور');

        setIsGeneratingText(true);
        try {
            const res = await fetch('/api/post/ai-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: selectedTemplate.name, name, additionalContext: context })
            });

            const data = await res.json();
            if (res.ok && data.variations) {
                setVariations(data.variations);
                setActiveText(data.variations[0]);
            } else {
                alert(data.error || 'خطأ في التوليد');
            }
        } catch (e) {
            alert('تعذر الاتصال بخادم الذكاء الاصطناعي');
        } finally {
            setIsGeneratingText(false);
        }
    };

    const handleExportImage = async () => {
        if (!postRef.current) return;
        setIsExporting(true);
        
        try {
            const dataUrl = await htmlToImage.toPng(postRef.current, {
                quality: 1.0,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `post_${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image', err);
            alert('حدث خطأ أثناء تصدير الصورة');
        } finally {
            setIsExporting(false);
        }
    };

    const handleTemplateSelect = (t: PostTemplate) => {
        setSelectedTemplate(t);
        setActiveText(t.arabic.replace('[الاسم]', name || '[الاسم]'));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b pb-4">📱 مولد المنشورات الذكي</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Controls - Left side layout */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold mb-4">1. اختر القالب</h2>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                            {POST_TEMPLATES.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => handleTemplateSelect(t)}
                                    className={`p-3 rounded-xl border text-sm text-right transition ${
                                        selectedTemplate.id === t.id 
                                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold' 
                                        : 'border-slate-200 hover:border-brand-300 bg-white'
                                    }`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold mb-4">2. مدخلات المحتوى</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم / الجهة</label>
                                <input 
                                    type="text" 
                                    className="w-full border p-2 rounded-lg bg-slate-50 focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="مثال: أحمد، شركة التقنية..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">تفاصيل إضافية للذكاء الاصطناعي</label>
                                <textarea 
                                    className="w-full border p-2 rounded-lg bg-slate-50 min-h-[80px] focus:ring-2 focus:ring-brand-500 outline-none"
                                    value={context}
                                    onChange={e => setContext(e.target.value)}
                                    placeholder="مثال: تخرج من جامعة الملك سعود بتفوق..."
                                />
                            </div>
                            <button
                                onClick={handleGenerateText}
                                disabled={isGeneratingText}
                                className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGeneratingText ? 'جاري السحر...' : '✨ توليد نصوص (1 نقطة)'}
                            </button>
                        </div>
                    </div>

                    {variations.length > 0 && (
                        <div className="bg-brand-50 p-6 rounded-2xl shadow-sm border border-brand-100">
                            <h2 className="text-lg font-bold mb-3 text-brand-900">خيارات الذكاء الاصطناعي</h2>
                            <div className="space-y-3">
                                {variations.map((v, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setActiveText(v)}
                                        className={`p-3 rounded-xl border text-sm cursor-pointer transition ${activeText === v ? 'bg-white border-brand-500 shadow-sm' : 'bg-brand-50/50 border-brand-200 hover:bg-white'}`}
                                    >
                                        {v}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview Box - Right side */}
                <div className="w-full lg:w-2/3 flex flex-col items-center">
                    <div className="bg-slate-200 w-full p-8 rounded-3xl flex items-center justify-center min-h-[500px]">
                        {/* The actual post DOM to export */}
                        <div 
                            ref={postRef}
                            className={`w-[400px] aspect-square flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br transition-all relative overflow-hidden
                                ${selectedTemplate.category === 'congratulation' ? 'from-blue-600 to-indigo-900 text-white' : 
                                    selectedTemplate.category === 'sale' ? 'from-red-500 to-rose-700 text-white' : 
                                    selectedTemplate.category === 'invitation' ? 'from-amber-100 to-yellow-300 text-slate-800' : 
                                'from-slate-800 to-slate-900 text-white shadow-2xl'}`}
                        >
                            {/* Decorative background shapes */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-xl -mb-10 -ml-10"></div>
                            
                            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 opacity-80 border-b border-current pb-2 px-4 shadow-sm z-10">
                                {selectedTemplate.name}
                            </h2>
                            <p className="text-2xl md:text-3xl font-extrabold leading-snug whitespace-pre-wrap z-10" dir="auto" contentEditable suppressContentEditableWarning onBlur={(e) => setActiveText(e.currentTarget.textContent || activeText)}>
                                {activeText}
                            </p>

                            <div className="absolute bottom-6 font-bold tracking-widest text-xs opacity-50 z-10">
                                CVSIRA.COM
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex gap-4 w-full justify-center max-w-lg">
                        <button 
                            onClick={handleExportImage}
                            disabled={isExporting}
                            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition text-lg flex justify-center items-center gap-2"
                        >
                            {isExporting ? 'جاري التصدير...' : '⬇️ تصدير كصورة PNG'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
