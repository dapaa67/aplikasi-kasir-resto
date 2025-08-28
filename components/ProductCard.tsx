// components/ProductCard.tsx

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Link from "next/link"; // <-- 1. Import Link
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  
  // Fungsi ini untuk mencegah link aktif saat tombol 'Tambah' diklik
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Mencegah navigasi Link
    onAddToCart(product);
  }

  return (
    // 2. Bungkus semua dengan <Link>
    <Link href={`/menu/${product.id}`} className="flex">
      <Card className="flex flex-col w-full hover:shadow-lg transition-shadow">
        <Image 
        src={product.gambar_url} 
        alt={product.nama_produk} 
        width={150} 
        height={150} 
        className="rounded-t-md object-cover h-32 w-full" 
        />
        
        <CardContent className="flex-grow p-4">
          <h3 className="font-semibold text-lg">{product.nama_produk}</h3>
          <p className="text-slate-600">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.harga)}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {/* 3. Update tombol dengan event handler baru */}
          <Button className="w-full" onClick={handleButtonClick}>
            Tambah
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}