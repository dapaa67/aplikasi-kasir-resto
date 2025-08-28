// components/OrderSummary.tsx

"use client";

import { useState } from "react";
import { CartItem, PaymentMethod } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Data yang akan dikirim ke parent component saat checkout
export interface OrderFormData {
  customerName: string;
  notes: string;
  paymentMethodId: number | null;
}

interface OrderSummaryProps {
  cart: CartItem[];
  paymentMethods: PaymentMethod[]; // <-- Butuh data metode pembayaran
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onSubmitOrder: (formData: OrderFormData) => void; // <-- Fungsi untuk submit
}

export default function OrderSummary({ cart, paymentMethods, onUpdateQuantity, onSubmitOrder }: OrderSummaryProps) {
  // State untuk form checkout, sekarang dikelola di sini
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  
  const subtotal = cart.reduce((acc, item) => acc + item.harga * item.quantity, 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const activePaymentMethods = paymentMethods.filter(method => method.is_active);

  const handleSubmit = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    if (!paymentMethodId) {
      alert("Silakan pilih metode pembayaran.");
      return;
    }
    onSubmitOrder({
      customerName,
      notes,
      paymentMethodId,
    });
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p className="text-slate-500 text-center">Keranjang masih kosong</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Jml</TableHead>
                <TableHead className="text-right">Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama_produk}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(item.harga * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Footer sekarang berisi kalkulasi DAN form checkout */}
      {cart.length > 0 && (
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <div className="w-full flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="w-full flex justify-between">
            <span>PPN (11%)</span>
            <span className="font-semibold">{formatCurrency(tax)}</span>
          </div>

          <hr className="w-full my-2" />

          {/* --- FORM CHECKOUT DIMASUKKAN DI SINI --- */}
          <div className="w-full space-y-3">
            <div>
                <Label htmlFor="customerName">Nama Pelanggan (Opsional)</Label>
                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
             <div>
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div>
                <Label>Metode Pembayaran</Label>
                <RadioGroup value={String(paymentMethodId)} onValueChange={(value) => setPaymentMethodId(Number(value))} className="mt-2">
                  {activePaymentMethods.map(method => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(method.id)} id={`pm-${method.id}`} />
                      <Label htmlFor={`pm-${method.id}`}>{method.nama_metode}</Label>
                    </div>
                  ))}
                </RadioGroup>
            </div>
          </div>
          {/* --- AKHIR FORM CHECKOUT --- */}
          
          <div className="w-full flex justify-between text-xl font-bold pt-4">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <Button className="w-full mt-4" size="lg" onClick={handleSubmit}>
            Buat Pesanan
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}