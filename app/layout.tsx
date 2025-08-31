// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image"; // <-- 1. Import Image
import { BookMarked, Receipt } from "lucide-react";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resto Kasir", // <-- 2. Ganti judul metadata
  description: "Aplikasi kasir untuk restoran",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-slate-100">
            <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
              <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                
                {/* --- PERUBAHAN UTAMA DI SINI --- */}
                <Link href="/" className="flex items-center gap-3">
                  <Image 
                    src="/favicon.png" // <-- 3. Panggil logo dari folder public
                    alt="Resto Kasir Logo" 
                    width={32} 
                    height={32} 
                  />
                  <span className="text-xl font-bold text-slate-800">
                    Kasir Ayam Goreng Suharti {/* <-- 4. Ganti teks judul */}
                  </span>
                </Link>
                {/* --- AKHIR PERUBAHAN --- */}

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