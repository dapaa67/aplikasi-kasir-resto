// app/riwayat/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderDetail } from "@/types";
import Link from "next/link";
import { Eye } from "lucide-react";

export const dynamic = 'force-dynamic';

// Fungsi untuk mengambil data riwayat pesanan dari API
async function getOrderHistory(): Promise<OrderDetail[]> {
  try {
    // Kita sudah punya proxy untuk /api/orders, jadi kita pakai itu
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
      cache: 'no-store', // Selalu ambil data terbaru
    });
    if (!response.ok) {
      throw new Error("Gagal mengambil riwayat pesanan");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return []; // Kembalikan array kosong jika error
  }
}

export default async function RiwayatPage() {
  const orders = await getOrderHistory();

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Riwayat Pesanan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Semua Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-slate-500">Belum ada riwayat pesanan.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status Bayar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.nama_pelanggan || 'Umum'}</TableCell>
                    <TableCell>{formatDate(order.waktu_order)}</TableCell>
                    <TableCell>{formatCurrency(order.total_harga)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status_pembayaran === 'LUNAS' ? 'default' : 'destructive'}>
                        {order.status_pembayaran.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/pesanan/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}