// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookMarked, Receipt } from "lucide-react";
import { CartProvider } from "@/context/CartContext"; // <-- 1. Import Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi Kasir Resto",
  description: "Aplikasi kasir sederhana dengan Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Bungkus semua dengan CartProvider */}
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-slate-100">
            <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
              <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-slate-800">
                  Resto Kasir Bro
                </Link>
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    <Receipt className="mr-2 h-4 w-4" />
                    Kasir
                  </Link>
                  <Link href="/riwayat" className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    <BookMarked className="mr-2 h-4 w-4" />
                    Riwayat Pesanan
                  </Link>
                </div>
              </nav>
            </header>
            
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}