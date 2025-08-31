// app/menu/[id]/page.tsx

"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // <-- 1. Import hook

// Halaman ini sekarang harus jadi Client Component untuk menggunakan hook
export default function ProductDetailPage() { // <-- 2. Hapus props `{ params }`
  const params = useParams(); // <-- 3. Gunakan hook
  const id = params.id as string; // Ambil 'id' dari params

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const getProductDetail = async () => {
        try {
          setLoading(true);
          // Gunakan proxy yang baru kita buat
          const response = await fetch(`/api/menu/${id}`);
          if (!response.ok) { 
            setProduct(null); 
            return; 
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error("Gagal fetch detail produk:", error);
          setProduct(null);
        } finally {
            setLoading(false);
        }
      };
      getProductDetail();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Loading produk...</div>;
  }
  
  if (!product) {
    return (
        <div className="text-center p-8">
            <p className="text-xl font-semibold">Produk tidak ditemukan.</p>
            <Button asChild variant="link" className="mt-4">
                <Link href="/">Kembali ke Menu</Link>
            </Button>
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
        <div>
          <Image
            src={product.gambar_url} 
            alt={product.nama_produk}
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            priority // Tambahkan priority untuk LCP
            />
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-slate-800">{product.nama_produk}</h1>
          <p className="text-2xl font-semibold text-blue-600 my-2">{formatCurrency(product.harga)}</p>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            {product.deskripsi}
          </p>

          <div className="mt-auto pt-8">
            <Button 
                size="lg" 
                className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 rounded-lg" 
                onClick={() => addToCart(product)}
            >
              <span>Tambah ke Keranjang</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}