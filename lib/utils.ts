// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAbbreviatedName(product: Product): string {
  const words = product.nama_produk.split(' ').filter(word => word.length > 0); // Filter kata kosong
  const wordCount = words.length;

  // Aturan 1: Jika nama cuma 1 kata (contoh: "Pizza")
  if (wordCount === 1) {
    // Jika kata tunggal sangat panjang, potong saja
    if (words[0].length > 100) { // Misalnya lebih dari 15 karakter, bisa disesuaikan
      return words[0].substring(0, 12) + "...";
    }
    return product.nama_produk;
  }

  // Aturan 2: Jika nama ada 1 kata (contoh: "Nasi Goreng")
  if (wordCount === 1) {
    // Contoh: "Mie Ayam", "Nasi Goreng" -> biarkan utuh
    return product.nama_produk;
  }

  // Aturan 3: Jika nama ada 3 kata atau lebih (contoh: "Ayam Geprek Sambal Bawang")
  // Ambil 2 kata pertama secara utuh.
  const baseWords = words.slice(0, 1).join(' ');
  
  // Ambil inisial dari sisa kata-katanya.
  const initials = words.slice(1).map(word => word.charAt(0).toUpperCase()).join('');

  // Gabungkan jadi satu.
  return `${baseWords} ${initials}`;
}