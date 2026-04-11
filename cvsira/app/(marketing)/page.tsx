import Link from 'next/link';

export default function MarketingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 to-slate-900 z-0"></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-600 rounded-full blur-[128px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-[128px] opacity-20"></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        سيرتك المهنية، منشوراتك، شهاداتك<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">في منصة واحدة</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        منصة سعودية تجمع الذكاء الاصطناعي مع الأدوات الرقمية الأكثر طلبًا. ابدأ الآن وانطلق بمسيرتك المهنية نحو القمة بخطوات بسيطة ونتائج احترافية.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 text-white font-bold text-lg hover:bg-brand-500 hover:scale-105 transition-all shadow-lg shadow-brand-500/30">
                            ابدأ مجانًا — 5 رصيد هدية
                        </Link>
                        <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2">
                            شاهد كيف تعمل ▶
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">كل ما تحتاجه لتعزيز هويتك المهنية</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">أدوات ذكية مصممة خصيصاً لتوفير وقتك وزيادة احترافيتك.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-brand-200 transition-all group">
                            <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                🎯
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">CV Builder</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                سيرة ذاتية ATS-Ready في ثوانٍ معدودة. اختر القالب، أدخل بياناتك أو اترك الذكاء الاصطناعي يكتبها لك بدقة.
                            </p>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all group">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                📱
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Post Generator</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                منشورات احترافية بقوالب جاهزة وذكاء اصطناعي لشبكات لينكدإن وغيرها. كن حاضراً بقوة وبأقل جهد.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-yellow-200 transition-all group">
                            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                🏆
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Certificate Engine</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                شهادات رقمية احترافية موثقة برمز استجابة سريعة QR، مع إمكانية التوليد الجماعي بضغطة زر.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-slate-50 text-center relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">كيف تعمل المنصة؟</h2>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connector Line (visible on desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-brand-50 flex items-center justify-center text-3xl font-black text-brand-600 mb-6">1</div>
                            <h3 className="text-2xl font-bold mb-3">سجّل مجانًا</h3>
                            <p className="text-slate-600">افتح حسابك واحصل على 5 نقاط رصيد هدية فورية لتجربة المنصة.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-brand-50 flex items-center justify-center text-3xl font-black text-brand-600 mb-6">2</div>
                            <h3 className="text-2xl font-bold mb-3">اختر الأداة</h3>
                            <p className="text-slate-600">اختر المنشئ الذي تحتاجه: سيرة ذاتية، منشور، أو شهادة وابدأ العمل.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-brand-50 flex items-center justify-center text-3xl font-black text-brand-600 mb-6">3</div>
                            <h3 className="text-2xl font-bold mb-3">خصّص وحمّل</h3>
                            <p className="text-slate-600">خصص المحتوى بلمساتك واعتمد على الذكاء الاصطناعي ثم حمل النتائج بجودة عالية.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">باقات تناسب احتياجك</h2>
                        <p className="text-lg text-slate-600 max-w-xl mx-auto">خياران مريحان: اشتراك شهري مستمر، أو شحن أرصدة لمرة واحدة.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Starter Plan */}
                        <div className="border border-slate-200 rounded-3xl p-8 flex flex-col bg-white">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                                <div className="text-slate-500">للبدايات والمستقلين</div>
                                <div className="mt-6 flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-slate-900">49</span>
                                    <span className="text-slate-500">ر.س / شهر</span>
                                </div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">✓</span> 100 نقطة رصيد شهرياً
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">✓</span> وصول لكافة أدوات الذكاء الاصطناعي
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">✓</span> تصدير بصيغة PDF عالية الجودة النقي
                                </li>
                            </ul>
                            <Link href="/register?plan=starter" className="w-full block text-center py-4 rounded-xl font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-900">
                                ابدأ الآن
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="border border-brand-200 rounded-3xl p-8 flex flex-col bg-brand-50 relative transform md:-translate-y-4 shadow-xl">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                الأكثر شعبية
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                                <div className="text-slate-500">للمحترفين وأصحاب المهام الثقيلة</div>
                                <div className="mt-6 flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-brand-600">129</span>
                                    <span className="text-slate-500">ر.س / شهر</span>
                                </div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">✓</span> 350 نقطة رصيد شهرياً
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">✓</span> كل مزايا باقة Starter
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">✓</span> أولوية الدعم الفني
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <span className="text-brand-600">✓</span> توليد الدفعات للشهادات
                                </li>
                            </ul>
                            <Link href="/register?plan=pro" className="w-full block text-center py-4 rounded-xl font-bold transition-all bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">
                                ترقية لـ Pro
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-16 text-center">
                        <Link href="/pricing" className="text-brand-600 font-bold hover:underline">
                            هل تبحث عن باقات النقاط لمرة واحدة؟ اضغط هنا للتعرف عليها
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
