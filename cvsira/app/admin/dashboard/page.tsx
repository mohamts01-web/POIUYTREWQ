import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch stats
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    
    // Total Credits Consumed
    const { data: usageData } = await supabase.from('usage_credits').select('points_balance');
    const totalCirculatingCredits = usageData?.reduce((acc, row) => acc + (row.points_balance || 0), 0) || 0;

    // Total CVs Generated
    const { count: cvsCount } = await supabase.from('cvs').select('*', { count: 'exact', head: true }).not('pdf_url', 'is', null);
    
    // Total Certificates Generated
    const { count: certsCount } = await supabase.from('certificates').select('*', { count: 'exact', head: true });

    // Latest Registered Users
    const { data: latestUsers } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at, role')
        .order('created_at', { ascending: false })
        .limit(5);

    // Latest Orders
    const { data: latestOrders } = await supabase
        .from('orders')
        .select('id, plan_id, amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">📊 النظرة العامة</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
                    <h3 className="text-slate-500 font-bold mb-2">إجمالي المستخدمين</h3>
                    <p className="text-3xl font-black text-slate-800">{usersCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
                    <h3 className="text-slate-500 font-bold mb-2">النقاط المتداولة (أرصدة)</h3>
                    <p className="text-3xl font-black text-slate-800">{totalCirculatingCredits}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-purple-500">
                    <h3 className="text-slate-500 font-bold mb-2">السير الذاتية المُصدرة</h3>
                    <p className="text-3xl font-black text-slate-800">{cvsCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500">
                    <h3 className="text-slate-500 font-bold mb-2">الشهادات المُصدرة</h3>
                    <p className="text-3xl font-black text-slate-800">{certsCount || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800">أحدث المستخدمين تسجيلاً</h2>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 text-slate-500 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">الاسم</th>
                                    <th className="p-4 font-medium">البريد</th>
                                    <th className="p-4 font-medium">الرتبة</th>
                                    <th className="p-4 font-medium">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {latestUsers?.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-bold text-slate-800">{user.full_name || 'غير محدد'}</td>
                                        <td className="p-4 text-slate-600">{user.email}</td>
                                        <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{user.role}</span></td>
                                        <td className="p-4 text-slate-500">{new Date(user.created_at).toLocaleDateString('ar-SA')}</td>
                                    </tr>
                                ))}
                                {(!latestUsers || latestUsers.length === 0) && (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">لا يوجد مستخدمين</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">أحدث الطلبات (شراء النقاط)</h2>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50 text-slate-500 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">رقم الطلب</th>
                                    <th className="p-4 font-medium">الباقة</th>
                                    <th className="p-4 font-medium">المبلغ</th>
                                    <th className="p-4 font-medium">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {latestOrders?.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-mono text-xs text-slate-500">{order.id.split('-')[0]}</td>
                                        <td className="p-4 font-bold text-slate-700">{order.plan_id}</td>
                                        <td className="p-4 text-brand-600 font-bold">{order.amount} ريال</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {order.status === 'completed' ? 'مكتمل' : 'معلق'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!latestOrders || latestOrders.length === 0) && (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">لا يوجد طلبات</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
