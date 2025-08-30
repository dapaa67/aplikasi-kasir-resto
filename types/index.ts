// types/index.ts

export interface Category {
  id: number;
  nama_kategori: string;
}

export interface PaymentMethod {
  id: number;
  nama_metode: string;
  is_active: boolean;
  nomor_rekening: string | null;
  nama_rekening: string | null;
  gambar_qris_url: string | null;
}

export interface Product {
  id: number;
  nama_produk: string;
  deskripsi: string;
  harga: number;
  gambar_url: string;
  kategori_id: number;
  kategori: {
    id: number;
    nama_kategori: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

// --- TIPE BARU UNTUK DETAIL PESANAN ---

// Produk di dalam item pesanan
interface ProductInOrder {
  id: number;
  nama_produk: string;
  harga: number;
  gambar_url: string;
}

// Item-item yang dipesan
export interface OrderItem {
  id: number;
  jumlah: number;
  subtotal: number;
  produk: ProductInOrder;
}

// Detail metode pembayaran di dalam pesanan
interface PaymentInOrder {
  id: number;
  metodepembayaran: {
    id: number;
    nama_metode: string;
    gambar_qris_url: string | null;
  }
}

// Struktur data utama untuk detail pesanan
export interface OrderDetail {
  id: number;
  waktu_order: string;
  nama_pelanggan: string;
  nomor_wa: string;
  total_harga: number;
  // Tambahkan dua properti opsional ini
  jumlah_uang_tunai?: number; // Tanda tanya (?) berarti properti ini boleh ada atau tidak
  kembalian?: number;
  status_pembayaran: "LUNAS" | "BELUM_BAYAR" | "KADALUARSA" | "DIBATALKAN";
  status_pesanan: "PESANAN_DITERIMA" | "DIPROSES" | "SIAP_DIKIRIM" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";
  catatan_pelanggan: string | null;
  orderitems: OrderItem[];
  pembayaran: PaymentInOrder[];
}