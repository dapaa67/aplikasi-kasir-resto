// components/ReceiptComponent.tsx

import { OrderDetail } from "@/types";
import React from "react";

interface ReceiptProps {
  order: OrderDetail;
}

// Kita gunakan React.forwardRef agar komponen ini bisa di-referensikan oleh hook react-to-print
export const ReceiptComponent = React.forwardRef<HTMLDivElement, ReceiptProps>(({ order }, ref) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

  return (
    // Komponen ini akan kita sembunyikan di halaman utama, tapi akan terlihat saat dicetak
    <div ref={ref} className="p-4 text-black bg-white font-mono text-xs">
      <div className="text-center mb-4">
        <h1 className="text-base font-bold">Resto Kasir Bro</h1>
        <p>Jl. Koding No. 123, Jakarta</p>
        <p>Telp: 0812-3456-7890</p>
      </div>

      <div className="mb-2">
        <p>No: #{order.id}</p>
        <p>Waktu: {formatDate(order.waktu_order)}</p>
        <p>Pelanggan: {order.nama_pelanggan || 'Umum'}</p>
        <p>Kasir: Bro Gemini</p>
      </div>

      <hr className="border-dashed border-black my-2" />

      <div>
        {order.orderitems.map(item => (
          <div key={item.id} className="grid grid-cols-12 gap-1">
            <div className="col-span-12">{item.produk.nama_produk}</div>
            <div className="col-span-4">{item.jumlah} x {formatCurrency(item.produk.harga)}</div>
            <div className="col-span-8 text-right">{formatCurrency(item.subtotal)}</div>
          </div>
        ))}
      </div>

      <hr className="border-dashed border-black my-2" />
      
      <div className="flex justify-between font-bold">
        <span>TOTAL</span>
        <span>{formatCurrency(order.total_harga)}</span>
      </div>

      <hr className="border-dashed border-black my-2" />
      
      <div className="text-center mt-4">
        <p>Terima Kasih!</p>
        <p>Silakan Lakukan Pembayaran</p>
      </div>
    </div>
  );
});

// Tambahkan display name untuk debugging
ReceiptComponent.displayName = 'ReceiptComponent';