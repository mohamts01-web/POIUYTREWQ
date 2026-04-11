import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function VerifyCertificatePage({
    params
}: {
    params: { code: string }
}) {
    const supabase = await createClient();
    
    // Using string matching to find the certificate.
    // Ensure RLS allows public select on 'certificates' for verifying
    const { data: cert, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('verification_code', params.code)
        .single();
        
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Link href="/" className="absolute top-8 left-8 font-bold text-2xl text-brand-600 flex items-center gap-2">
                <span className="text-2xl">🚀</span> CvSira
            </Link>

            <div className="bg-white max-w-lg w-full rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
                
                {error || !cert ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">شهادة غير صالحة</h1>
                        <p className="text-slate-500 mb-6">
                            الرمز ({params.code}) غير موجود أو غير صحيح. لم نتمكن من التحقق من صحة هذه الشهادة في سجلاتنا.
                        </p>
                        <Link href="/" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-medium">
                            العودة للرئيسية
                        </Link>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-3xl font-black text-green-600 mb-2">شهادة موثقة ورسمية</h1>
                        <p className="text-slate-600 mb-8 border-b pb-6">
                            تم فحص هذه الشهادة وهي مسجلة بنجاح وحقيقية في نظام CvSira.
                        </p>

                        <div className="space-y-4 text-right bg-slate-50 p-6 rounded-2xl mb-8">
                            <div>
                                <span className="block text-sm text-slate-500 font-bold mb-1">صادرة باسم:</span>
                                <span className="text-xl font-bold text-slate-900">{cert.recipient_name}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500 font-bold mb-1">اسم الدورة/البرنامج:</span>
                                <span className="text-lg text-slate-800">{cert.course_name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-sm text-slate-500 font-bold mb-1">تاريخ الإصدار:</span>
                                    <span className="text-slate-800">{new Date(cert.issued_date || cert.created_at).toLocaleDateString('ar-SA')}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-slate-500 font-bold mb-1">رقم الفحص (QR):</span>
                                    <span className="text-slate-800 font-mono text-sm">{cert.verification_code}</span>
                                </div>
                            </div>
                        </div>

                        {cert.pdf_url && (
                            <a 
                                href={cert.pdf_url} 
                                target="_blank"
                                rel="noreferrer"
                                className="w-full inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-4 rounded-xl shadow-md transition"
                            >
                                تحميل أو عرض الشهادة الأصلية (PDF)
                            </a>
                        )}
                        <p className="text-xs text-slate-400 mt-4">
                            تم الفحص بواسطة تقنيات CvSira للاستعلام الآلي
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
