import Link from 'next/link';


export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-2xl text-brand-600 flex items-center gap-2">
                        <span className="text-3xl">🚀</span> CvSira
                    </Link>
                    <nav className="hidden md:flex gap-6 items-center font-medium text-slate-600">
                        <Link href="#features" className="hover:text-brand-600 transition">المميزات</Link>
                        <Link href="#how-it-works" className="hover:text-brand-600 transition">كيف تعمل</Link>
                        <Link href="#pricing" className="hover:text-brand-600 transition">الأسعار</Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="text-sm font-medium hover:text-brand-600 transition hidden sm:inline-block">
                            تسجيل الدخول
                        </Link>
                        <Link href="/register" className="px-4 py-2 rounded-full bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition shadow-md">
                            ابدأ مجاناً
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
                    <div>
                        <Link href="/" className="font-bold text-2xl text-white flex items-center gap-2 mb-4">
                            <span className="text-3xl">🚀</span> CvSira
                        </Link>
                        <p className="text-sm text-slate-400">
                            منصة سعودية تجمع الذكاء الاصطناعي مع الأدوات الرقمية الأكثر طلبًا.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">المنتجات</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/cv-builder" className="hover:text-white transition">سيرة ذاتية بالذكاء الاصطناعي</Link></li>
                            <li><Link href="/post-generator" className="hover:text-white transition">توليد مسودات منشورات</Link></li>
                            <li><Link href="/certificates" className="hover:text-white transition">شهادات رقمية موثقة</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">الشركة</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition">من نحن</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition">الباقات والأسعار</Link></li>
                            <li><Link href="#" className="hover:text-white transition">الأسئلة الشائعة</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">قانوني</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition">شروط الاستخدام</Link></li>
                            <li><Link href="#" className="hover:text-white transition">سياسة الخصوصية</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} CvSira. جميع الحقوق محفوظة.
                </div>
            </footer>
        </div>
    );
}
