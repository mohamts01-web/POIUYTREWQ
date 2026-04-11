import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: wallet } = await supabase
        .from('usage_credits')
        .select('credits_balance')
        .eq('user_id', user.id)
        .single();

    const balance = wallet?.credits_balance ?? 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="font-bold text-2xl text-brand-600 flex items-center gap-2">
                        <span className="text-2xl">🚀</span> CvSira
                    </Link>
                    
                    <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-600">
                        <Link href="/dashboard" className="hover:text-brand-600">لوحة التحكم</Link>
                        <Link href="/cv-builder" className="hover:text-brand-600">منشئ السير الذاتية</Link>
                        <Link href="/post-generator" className="hover:text-brand-600">منشورات AI</Link>
                        <Link href="/certificates" className="hover:text-brand-600">الشهادات</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-bold text-brand-700">
                            <span>🪙</span>
                            <span>{balance} رصيد</span>
                        </div>
                        <Link 
                            href="/payment" 
                            className="text-xs bg-brand-100 text-brand-700 hover:bg-brand-200 px-3 py-1.5 rounded-full font-bold transition"
                        >
                            شحن
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
