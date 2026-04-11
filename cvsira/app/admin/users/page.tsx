import { createClient } from '@/lib/supabase/server';

export default async function AdminUsersPage() {
    const supabase = await createClient();

    // Fetch all users with their point balances
    // Since Supabase doesn't support joins natively in a simple select unless defined via FK matching correctly,
    // we'll get profiles, and map usages if necessary, or just query profiles.
    
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch usages separately to merge them if needed
    const { data: usages } = await supabase
        .from('usage_credits')
        .select('user_id, points_balance, is_premium');

    const combinedUsers = users?.map(user => {
        const usage = usages?.find(u => u.user_id === user.id);
        return {
            ...user,
            points_balance: usage?.points_balance || 0,
            is_premium: usage?.is_premium || false,
        };
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">👥 إدارة المستخدمين</h1>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="ابحث عن اسم أو إيميل..." 
                        className="border p-2 rounded-lg bg-white shadow-sm w-64 text-sm"
                    />
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">بحث</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-right min-w-[800px]">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-medium">المستخدم</th>
                                <th className="p-4 font-medium">البريد الإلكتروني</th>
                                <th className="p-4 font-medium">الرتبة</th>
                                <th className="p-4 font-medium">النقاط متبقية</th>
                                <th className="p-4 font-medium">حالة الحساب</th>
                                <th className="p-4 font-medium">تاريخ التسجيل</th>
                                <th className="p-4 font-medium text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {combinedUsers?.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                                                {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                                            </div>
                                            {user.full_name || 'بدون اسم'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold">
                                        <span className="text-brand-600 bg-brand-50 px-2 py-1 rounded">{user.points_balance} ن</span>
                                    </td>
                                    <td className="p-4">
                                        {user.is_premium ? (
                                            <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold">بريميوم 👑</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs">مجاني</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-500">{new Date(user.created_at).toLocaleDateString('ar-SA')}</td>
                                    <td className="p-4 text-center">
                                        <button className="text-slate-400 hover:text-brand-600 transition">⚙️ تعديل</button>
                                    </td>
                                </tr>
                            ))}
                            {(!combinedUsers || combinedUsers.length === 0) && (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-500">لا يوجد مستخدمين بعد</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
