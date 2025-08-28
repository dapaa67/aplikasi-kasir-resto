// app/cetak/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // <-- LANGKAH 1: Import hook useParams
import { OrderDetail } from "@/types";

// LANGKAH 2: Hapus props `{ params }` dari sini
export default function CetakStrukPage() {
  const params = useParams(); // <-- LANGKAH 3: Gunakan hook untuk mengambil params
  const id = params.id as string; // Ambil 'id' dari objek params

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pastikan 'id' sudah ada sebelum fetch
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/orders/${id}`);
          if (!response.ok) {
            throw new Error('Gagal memuat data pesanan');
          }
          const data = await response.json();
          setOrder(data);
          // Tunggu data ter-render, lalu panggil window.print()
          setTimeout(() => window.print(), 500);
        } catch (err) {
        if (err instanceof Error) {
            // Lakukan sesuatu dengan err.message
            setError(err.message); // atau alert(err.message)
        } else {
            // Handle error yang tipenya tidak diketahui
            setError('Terjadi kesalahan yang tidak diketahui'); // atau alert(...)
        }
        }
      };
      fetchOrder();
    }
  }, [id]); // Dependency array tetap [id]

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {}).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

  if (error) return <p className="text-center p-8">Error: {error}</p>;
  if (!order) return <p className="text-center p-8">Memuat struk...</p>;

  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .printable-area, .printable-area * {
        visibility: visible;
      }
      .printable-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
  `;

  return (
    <div className="bg-white text-black font-mono p-4 max-w-[300px] mx-auto text-xs printable-area">
      <style>{printStyles}</style>
      
      <div className="text-center mb-2">
        <h1 className="font-bold text-sm">Resto Kasir Bro</h1>
        <p>Jl. Koding No. 123, Jakarta</p>
      </div>
      
      <hr className="my-2 border-dashed border-black"/>
      
      <div>
        <p>No: #{order.id}</p>
        <p>Waktu: {formatDate(order.waktu_order)}</p>
        <p>Pelanggan: {order.nama_pelanggan || 'Umum'}</p>
      </div>
      
      <hr className="my-2 border-dashed border-black"/>
      
      {order.orderitems.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-1 my-1">
          <div className="col-span-12">{item.produk.nama_produk}</div>
          <div className="col-span-5">{item.jumlah} x {formatCurrency(item.produk.harga)}</div>
          <div className="col-span-7 text-right">{formatCurrency(item.subtotal)}</div>
        </div>
      ))}

      <hr className="my-2 border-dashed border-black"/>
      
      <div className="flex justify-between font-bold">
        <span>TOTAL</span>
        <span>Rp {formatCurrency(order.total_harga)}</span>
      </div>
      
      <hr className="my-2 border-dashed border-black"/>

      <p className="text-center mt-2">--- Terima Kasih ---</p>
    </div>
  );
}