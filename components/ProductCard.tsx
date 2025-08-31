// components/ProductCard.tsx

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const fallbackImage = "/placeholder-food.jpg"; 

  return (
    <Link href={`/menu/${product.id}`} className="flex group h-full">
      {/* Perubahan di sini: rounded-xl dipindahkan, p-0 ditambahkan */}
      <Card className="flex flex-col w-full h-full overflow-hidden transition-all duration-300 cursor-pointer border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 rounded-xl p-0">
        
        {/* div ini sekarang yang punya rounded-t-xl */}
        <div className="relative overflow-hidden aspect-square rounded-t-xl">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="w-6 h-6 border-2 border-t-transparent border-slate-300 rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={imageError ? fallbackImage : product.gambar_url}
            alt={product.nama_produk}
            fill
            sizes="(max-width: 767px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={false}
          />
        </div>

        {/* CardContent sekarang punya padding sendiri */}
        <CardContent className="flex-grow px-4 pb-2 pt-3 flex flex-col">
          <div className="flex-grow">
            <h3 className="font-bold text-slate-800 text-base line-clamp-2 leading-tight">
              {product.nama_produk}
            </h3>
          </div>
          <p className="text-blue-600 font-bold text-base pt-2">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(product.harga)}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto"> {/* Padding footer disesuaikan */}
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors rounded-lg py-2 h-10 text-sm font-semibold flex items-center justify-center gap-2"
            onClick={handleButtonClick}
            aria-label={`Tambah ${product.nama_produk} ke keranjang`}
          >
            <ShoppingCart size={16} />
            <span>Tambah</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}