// app/page.tsx

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from "@/components/ProductCard";
import OrderSummary, { OrderFormData } from "@/components/OrderSummary"; // <-- Import tipe baru
import { Product, CartItem, Category, PaymentMethod } from '@/types';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Mengambil data produk dan kategori dari API
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

  // Logika untuk memfilter produk berdasarkan kategori yang dipilih
  const filteredProducts = selectedCategory
    ? products.filter(product => product.kategori_id === selectedCategory)
    : products;

  // --- Fungsi-fungsi untuk keranjang belanja (tidak ada perubahan) ---
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      } else {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }
    });
  };

  // Fungsi ini sekarang menerima data form dari OrderSummary
  const handleCreateOrder = async (formData: OrderFormData) => {
    const subtotal = cart.reduce((acc, item) => acc + item.harga * item.quantity, 0);
    const tax = subtotal * 0.11;
    const total = subtotal + tax;

    const cartItemsForAPI = cart.map(item => ({ ...item, jumlah: item.quantity }));

    const payload = {
      cartItems: cartItemsForAPI,
      nama_pelanggan: formData.customerName,
      nomor_wa: "", // Kita hapus nomor WA dari form untuk simplifikasi
      total_harga: total,
      catatan_pelanggan: formData.notes,
      metode_pembayaran_id: formData.paymentMethodId,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Gagal membuat pesanan. Status: ' + response.status);
      }

      const result = await response.json();
      const newOrderId = result.id;
      
      setCart([]); // Kosongkan keranjang
      router.push(`/pesanan/${newOrderId}`); // Arahkan ke halaman detail pesanan

    } catch (error) {
      console.error('Terjadi kesalahan saat membuat pesanan:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  // --- Akhir dari fungsi keranjang belanja ---

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">Resto Kasir Bro</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            
            {/* --- Bagian Tombol Filter Kategori --- */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
              >
                Semua
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.nama_kategori}
                </Button>
              ))}
            </div>
            {/* --- Akhir Bagian Tombol Filter --- */}

            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Menu</h2>
            {isLoading ? (
              <p>Lagi ngambil menu, bro...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Render produk yang sudah difilter */}
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div>
             <OrderSummary 
               cart={cart}
               paymentMethods={paymentMethods} // <-- Kirim data metode pembayaran
               onUpdateQuantity={handleUpdateQuantity} 
               onSubmitOrder={handleCreateOrder} // <-- Kirim fungsi submit
             />
          </div>
        </div>
      </div>
    </main>
  );
}