'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. إنشاء الحساب
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) throw error;

            if (data?.user) {
                // 2. Add via API to run secure initial credits & roles according to the plan
                const response = await fetch('/api/auth/register-setup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: data.user.id }),
                })

                if (!response.ok) {
                   console.error("Failed to setup initial user data");
                }
                
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                إنشاء حساب جديد
            </h3>
            <p className="text-sm text-brand-600 text-center mb-6 font-medium">✨ ستحصل على 5 نقاط رصيد مجانية!</p>

            <form onSubmit={handleRegister} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                        {error}
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-slate-700">الاسم الكامل</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                        dir="ltr"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">كلمة المرور</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                        dir="ltr"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
                >
                    {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-slate-600">لديك حساب بالفعل؟ </span>
                <Link href="/login" className="font-medium text-brand-600 hover:text-brand-500">
                    تسجيل الدخول
                </Link>
            </div>
        </div>
    );
}
