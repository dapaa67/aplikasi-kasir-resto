// components/ProductCard.tsx

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onAddToCart(product);
  }

  return (
    <Link href={`/menu/${product.id}`} className="flex">
      <Card className="flex flex-col w-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
        <Image 
          src={product.gambar_url} 
          alt={product.nama_produk} 
          width={200} 
          height={200} 
          className="rounded-t-md object-cover h-32 w-full" 
        />
        
        <CardContent className="flex-grow p-4">
          <h3 className="font-semibold text-lg">{product.nama_produk}</h3>
          <p className="text-slate-600">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.harga)}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          <Button className="w-full" onClick={handleButtonClick}>
            Tambah
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}