// components/OrderDetailsView.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderDetail } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Home, Printer, Upload } from "lucide-react";
import Link from "next/link";

interface OrderDetailsViewProps {
  id: string;
}

export default function OrderDetailsView({ id }: OrderDetailsViewProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error("Pesanan tidak ditemukan");
      }
      const data = await response.json();
      setOrder(data);
    } catch (err) {
    if (err instanceof Error) {
        // Lakukan sesuatu dengan err.message
        setError(err.message); // atau alert(err.message)
    } else {
        // Handle error yang tipenya tidak diketahui
        setError('Terjadi kesalahan yang tidak diketahui'); // atau alert(...)
    }
    } finally {
      setLoading(false);
    }
  }, [id]); // Dependency-nya adalah 'id'

  useEffect(() => {
    // 2. Sekarang useEffect tinggal panggil fungsinya
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // FUNGSI BARU UNTUK CETAK STRUK
  const handlePrint = () => {
    window.open(`/cetak/${id}`, '_blank');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile) {
      alert("Silakan pilih file bukti pembayaran.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('bukti', selectedFile);
    try {
      const response = await fetch(`/api/konfirmasi-pembayaran/${id}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Gagal mengunggah bukti.");
      }
      const result = await response.json();
      alert(result.message || "Upload bukti berhasil!");
      setUploadModalOpen(false);
      setSelectedFile(null);
      await fetchOrderDetail();
    } catch (err) {
    if (err instanceof Error) {
        // Lakukan sesuatu dengan err.message
        setError(err.message); // atau alert(err.message)
    } else {
        // Handle error yang tipenya tidak diketahui
        setError('Terjadi kesalahan yang tidak diketahui'); // atau alert(...)
    }
    }finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });

  if (loading) return <div className="text-center p-10">Loading detail pesanan...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!order) return null;

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Detail Pesanan</CardTitle>
          <p className="text-slate-500">Nomor Pesanan: #{order.id}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p><strong>Pelanggan:</strong> {order.nama_pelanggan || '-'}</p>
              <p><strong>Waktu:</strong> {formatDate(order.waktu_order)}</p>
            </div>
            <div className="text-right">
              <p>Status Pesanan:</p>
              <Badge variant="secondary" className="mb-1">{order.status_pesanan.replace(/_/g, ' ')}</Badge>
              <p>Status Pembayaran:</p>
              <Badge variant={order.status_pembayaran === 'LUNAS' ? 'default' : 'destructive'}>{order.status_pembayaran.replace(/_/g, ' ')}</Badge>
            </div>
          </div>
          <p className="font-semibold mb-2">Rincian Item:</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderitems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.produk.nama_produk}</TableCell>
                  <TableCell className="text-center">{item.jumlah}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <div className="mt-4 pt-4 border-t space-y-1 text-right text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.total_harga / 1.11)}</span>
            </div>
             <div className="flex justify-between">
              <span>PPN (11%)</span>
              <span>{formatCurrency(order.total_harga - (order.total_harga / 1.11))}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatCurrency(order.total_harga)}</span>
            </div>
            {/* Tampilkan jika ada data uang tunai */}
            {order.jumlah_uang_tunai && order.jumlah_uang_tunai > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Uang Tunai</span>
                  <span>{formatCurrency(order.jumlah_uang_tunai)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-600">
                  <span>Kembalian</span>
                  <span>{formatCurrency(order.kembalian || 0)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
            <Button variant="outline" asChild>
                <Link href="/"><Home className="mr-2 h-4 w-4" /> Buat Pesanan Baru</Link>
            </Button>
            <div className="flex gap-2">
                {order.status_pembayaran === 'BELUM_BAYAR' && (
                    <Button onClick={() => setUploadModalOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Konfirmasi Pembayaran
                    </Button>
                )}
                {/* TOMBOL INI SEKARANG MEMANGGIL FUNGSI BARU */}
                <Button variant="secondary" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Cetak Struk
                </Button>
            </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {selectedFile && <p className="text-sm mt-2 text-slate-500">File dipilih: {selectedFile.name}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={handleUploadProof} disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? 'Mengunggah...' : 'Upload & Konfirmasi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}