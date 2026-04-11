import { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-slate-100 flex" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/admin/dashboard" className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>🛡️</span> لوحة الإدارة
                    </Link>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="block px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition">
                        📊 نظرة عامة
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition">
                        👥 إدارة المستخدمين
                    </Link>
                    <Link href="/admin/orders" className="block px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition">
                        💳 الطلبات والنقاط
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-center bg-slate-800 text-white rounded hover:bg-brand-600 transition">
                        العودة للمنصة
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 mr-64 p-8">
                {children}
            </main>
        </div>
    );
}
