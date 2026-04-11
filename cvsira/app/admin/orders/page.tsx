import { createClient } from '@/lib/supabase/server';

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    // Fetch all orders
    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            profiles:user_id ( full_name, email )
        `)
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">💳 الطلبات وتعبئة الرصيد</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-right min-w-[800px]">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-medium">رقم الطلب</th>
                                <th className="p-4 font-medium">المستخدم</th>
                                <th className="p-4 font-medium">وصف الباقة (النقاط)</th>
                                <th className="p-4 font-medium">المبلغ</th>
                                <th className="p-4 font-medium">طريقة الدفع</th>
                                <th className="p-4 font-medium">حالة الطلب</th>
                                <th className="p-4 font-medium">تاريخ العملية</th>
                                <th className="p-4 font-medium text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {orders?.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-mono text-xs text-slate-500">{order.id.split('-')[0]}</td>
                                    <td className="p-4 font-bold text-slate-800">
                                        {/* @ts-ignore */}
                                        {order.profiles?.full_name || order.profiles?.email || 'غير معروف'}
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bold text-brand-700">{order.plan_id || 'مخصص'}</span>
                                        <span className="text-xs text-slate-500 mr-2">({order.credits} نقطة)</span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-700">{order.amount} SAR</td>
                                    <td className="p-4">
                                        {order.payment_method === 'paypal' ? (
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">PayPal</span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">حوالة بنكية</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            order.status === 'completed' || order.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {order.status === 'completed' || order.status === 'approved' ? 'مكتمل' : 
                                             order.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500" dir="ltr">{new Date(order.created_at).toLocaleString('en-SA')}</td>
                                    <td className="p-4 text-center">
                                        {order.status !== 'completed' && order.status !== 'approved' && order.payment_method === 'bank' ? (
                                            <div className="flex gap-2 justify-center">
                                                <button className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs">تأكيد</button>
                                                <button className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-xs">رفض</button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs">لا يوجد إجراء</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!orders || orders.length === 0) && (
                                <tr><td colSpan={8} className="p-8 text-center text-slate-500">لا يوجد طلبات بعد</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
