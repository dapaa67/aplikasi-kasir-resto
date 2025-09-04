// app/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from "@/components/ProductCard";
import OrderSummary, { OrderFormData } from "@/components/OrderSummary";
import { Product, Category, PaymentMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext'; // <-- Import hook useCart

export default function HomePage() {
  const router = useRouter();
  
  // Ambil data dan fungsi dari "Pusat Data"
  const { cart, addToCart, updateQuantity, clearCart, getCartTotal } = useCart();
  
  // State lokal halaman ini sekarang hanya untuk produk dan filter
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    // useEffect untuk fetch data tetap sama
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, paymentMethodsResponse] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/kategori'),
          fetch('/api/metode-pembayaran')
        ]);
        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        const paymentMethodsData = await paymentMethodsResponse.json();
        setProducts(productsData);
        setCategories(categoriesData);
        setPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.kategori_id === selectedCategory)
    : products;

  const handleCreateOrder = async (formData: OrderFormData) => {
    const total = getCartTotal(); // Ambil total dari context
    const cartItemsForAPI = cart.map(item => ({ ...item, jumlah: item.quantity }));

    const payload = {
      cartItems: cartItemsForAPI,
      nama_pelanggan: formData.customerName,
      tipe_pesanan: "OFFLINE",
      nomor_wa: "",
      total_harga: total,
      catatan_pelanggan: formData.notes,
      metode_pembayaran_id: formData.paymentMethodId,
      jumlah_uang_tunai: formData.cashAmount,
      kembalian: formData.cashAmount > 0 ? formData.cashAmount - total : 0,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) { throw new Error('Gagal membuat pesanan. Status: ' + response.status); }
      const result = await response.json();
      
      clearCart(); // <-- Gunakan fungsi clearCart dari context
      router.push(`/pesanan/${result.id}`);

    } catch (error) {
      if (error instanceof Error) { alert('Terjadi kesalahan: ' + error.message); } 
      else { alert('Terjadi kesalahan yang tidak diketahui.'); }
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              // Tambahkan className kondisional untuk menimpa warna default
              className={selectedCategory === null ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent' : ''}
              onClick={() => setSelectedCategory(null)}
            >
              Semua
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                // Tambahkan className kondisional di sini juga
                className={selectedCategory === category.id ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent' : ''}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.nama_kategori}
              </Button>
            ))}
          </div>
            {isLoading ? <p>Lagi ngambil menu, bro...</p> : (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{filteredProducts.map((product) => (<ProductCard key={product.id} product={product} onAddToCart={addToCart}/>))}</div>)}
          </div>
          <div>
            <div className="sticky top-24">
             <OrderSummary 
               cart={cart} // <-- Kirim cart dari context
               paymentMethods={paymentMethods}
               onUpdateQuantity={updateQuantity} // <-- Kirim updateQuantity dari context
               onSubmitOrder={handleCreateOrder}
             />
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}