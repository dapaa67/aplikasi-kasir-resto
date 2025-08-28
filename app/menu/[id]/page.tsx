// app/menu/[id]/page.tsx

import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

// Fungsi untuk mengambil data satu produk dari API
async function getProductDetail(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`https://ayamgorengsuharti.vercel.app/api/menu/${id}`, {
      // Menambahkan revalidate untuk memastikan data tidak terlalu lama di-cache
      next: { revalidate: 60 } // Revalidate setiap 60 detik
    });
    if (!response.ok) {
      return null; // Produk tidak ditemukan atau error lainnya
    }
    return response.json();
  } catch (error) {
    console.error("Gagal fetch detail produk:", error);
    return null;
  }
}

// Ini adalah halaman kita, dia menerima `params` dari URL
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductDetail(params.id);

  // Jika produk tidak ditemukan, tampilkan pesan
  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <Link href="/">
          <Button variant="link" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Menu
          </Button>
        </Link>
      </div>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Menu
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Gambar */}
        <div>
          <Image
            src={product.gambar_url} 
            alt={product.nama_produk}
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
        </div>

        {/* Kolom Detail & Aksi */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-slate-800">{product.nama_produk}</h1>
          <p className="text-2xl font-semibold text-blue-600 my-2">{formatCurrency(product.harga)}</p>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            {product.deskripsi}
          </p>

          <div className="mt-auto pt-6">
            <Button size="lg" className="w-full">
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}