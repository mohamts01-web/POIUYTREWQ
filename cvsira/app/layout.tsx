import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
    title: "CvSira - الذكاء الاصطناعي للسير الذاتية والشهادات",
    description: "منصة سعودية تجمع الذكاء الاصطناعي مع الأدوات الرقمية الأكثر طلبًا. سيرتك المهنية، منشوراتك، شهاداتك — في منصة واحدة",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body className={`${cairo.variable} font-sans antialiased text-slate-800 bg-slate-50`}>
                {children}
            </body>
        </html>
    );
}
