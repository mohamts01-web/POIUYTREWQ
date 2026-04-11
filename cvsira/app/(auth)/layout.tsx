import Link from 'next/link';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center text-center">
                    <span className="text-4xl">🚀</span>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-brand-600">
                        CvSira
                    </h2>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
                    {children}
                </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} 플랫폼 CvSira. جميع الحقوق محفوظة.</p>
            </div>
        </div>
    );
}
