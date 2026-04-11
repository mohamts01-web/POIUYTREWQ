import { createClient } from '@/lib/supabase/server';
import { creditValueHint } from '@/lib/pricing';
import { getUpsellSuggestion } from '@/lib/upsell';
import Link from 'next/link';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch user details
    const { data: userNameData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

    // Fetch Wallet
    const { data: wallet } = await supabase
        .from('usage_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();
    
    // Fetch Recent Orders
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch Generic Analytics (Usage estimation)
    const { data: events } = await supabase
        .from('platform_events')
        .select('type')
        .eq('user_id', user.id);
    
    const cvUsage = events?.filter(e => e.type === 'cv_generated').length || 0;
    const postUsage = events?.filter(e => e.type === 'post_created').length || 0;
    const certUsage = events?.filter(e => e.type === 'certificate_issued').length || 0;

    const balance = wallet?.credits_balance ?? 0;
    const plan = wallet?.subscription_plan ?? 'free';
    const trialUsed = wallet?.trial_pdf_used ?? false;

    // Smart Upsell Logic
    const upsell = getUpsellSuggestion(
        { cv: cvUsage, post: postUsage, cert: certUsage },
        plan,
        balance
    );

    const userName = userNameData?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم';

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
            {/* Header section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">مرحبًا، {userName} 👋</h1>
                    <div className="text-slate-500 font-medium flex items-center gap-2">
                        <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm">باقة: {plan}</span>
                        <span>•</span>
                        <span>{balance} نقطة רصيد</span>
                        <span className="text-slate-400">({creditValueHint(balance)})</span>
                    </div>
                </div>
                
                {!trialUsed && (
                    <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-2xl flex items-center gap-3">
                        <span className="text-2xl">🎁</span>
                        <div>
                            <div className="font-bold">تحميل PDF مجاني متاح</div>
                            <div className="text-sm">للنسخة التجريبية الأولى الخاصة بك</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Smart Warnings / Upsell */}
            {balance < 20 && balance > 0 && !upsell && (
                <div className="bg-yellow-50 text-yellow-800 p-4 border border-yellow-200 rounded-2xl flex gap-3 items-center">
                    <span>⚠️</span>
                    <div className="flex-1">
                        <span className="font-bold">رصيدك منخفض! </span>
                        قد لا تتمكن من إنجاز المهام قريبًا.
                    </div>
                    <Link href="/payment" className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-300">
                        اشحن الآن
                    </Link>
                </div>
            )}
            {balance === 0 && (
                <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-2xl flex gap-3 items-center">
                    <span>🛑</span>
                    <div className="flex-1">
                        <span className="font-bold">رصيدك نفد! </span>
                        يرجى شحن رصيدك لمتابعة الإنجاز.
                    </div>
                    <Link href="/payment" className="bg-red-200 text-red-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-300">
                        اشحن الآن
                    </Link>
                </div>
            )}
            {upsell && (
                <div className="bg-brand-50 text-brand-900 p-4 border border-brand-200 rounded-2xl flex gap-3 items-center">
                    <span>🔥</span>
                    <div className="flex-1 font-medium">{upsell.message}</div>
                    <Link href={upsell.href} className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-700 shadow-md">
                        {upsell.cta}
                    </Link>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span>⚡</span> إجراءات سريعة
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/cv-builder" className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition ${balance === 0 ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50' : 'bg-white hover:border-brand-500 hover:shadow-md border-slate-200'}`}>
                        <span className="text-4xl mb-3">📄</span>
                        <span className="font-bold text-slate-800">بناء CV</span>
                    </Link>
                    <Link href="/post-generator" className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition ${balance === 0 ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50' : 'bg-white hover:border-blue-500 hover:shadow-md border-slate-200'}`}>
                        <span className="text-4xl mb-3">📱</span>
                        <span className="font-bold text-slate-800">مولد البوستات</span>
                    </Link>
                    <Link href="/certificates" className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition ${balance === 0 ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50' : 'bg-white hover:border-yellow-500 hover:shadow-md border-slate-200'}`}>
                        <span className="text-4xl mb-3">🏆</span>
                        <span className="font-bold text-slate-800">إصدار شهادات</span>
                    </Link>
                    <Link href="/payment" className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex flex-col items-center justify-center text-center transition">
                        <span className="text-4xl mb-3">💳</span>
                        <span className="font-bold text-slate-800">شراء باقة/نقاط</span>
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Stats */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span>📊</span> إحصائيات الاستخدام
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-600 font-medium">السير الذاتية المنشأة</span>
                            <span className="font-black text-xl text-slate-900">{cvUsage}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-600 font-medium">المنشورات المولدة</span>
                            <span className="font-black text-xl text-slate-900">{postUsage}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-600 font-medium">الشهادات المُصدرة</span>
                            <span className="font-black text-xl text-slate-900">{certUsage}</span>
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span>📦</span> آخر الطلبات
                    </h3>
                    <div className="space-y-3">
                        {orders && orders.length > 0 ? (
                            orders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                                    <div>
                                        <div className="font-bold text-sm text-slate-800">{order.type === 'credits' ? `باقة ${order.credits} رصيد` : `اشتراك ${order.plan}`}</div>
                                        <div className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('ar-SA')}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">{order.amount} {order.currency}</div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">لا توجد طلبات سابقة.</div>
                        )}
                    </div>
                    {orders && orders.length > 0 && (
                        <div className="mt-4 text-center">
                            <Link href="/orders" className="text-brand-600 text-sm font-bold hover:underline">عرض كل الطلبات</Link>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Feedback Mini Section */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 text-center shadow-lg">
                <h3 className="text-lg font-bold mb-2">رأيك يهمنا 💬</h3>
                <p className="text-slate-300 text-sm mb-4">نحن نتطور بفضلك، شاركنا تجربتك أو اقترح ميزة جديدة!</p>
                <button className="bg-white text-slate-900 px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-slate-100 transition">
                    إرسال تعليق ⭐
                </button>
            </div>
        </div>
    );
}
