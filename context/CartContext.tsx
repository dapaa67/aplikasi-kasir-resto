// context/CartContext.tsx

"use client";

import { createContext, useState, useContext, ReactNode } from 'react';
import { Product, CartItem } from '@/types';

// 1. Definisikan "kamus" untuk data dan fungsi di dalam context
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// 2. Buat Context-nya
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Buat Provider (Komponen yang akan "menyediakan" state)
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const getCartTotal = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.harga * item.quantity, 0);
    return subtotal * 1.11; // Subtotal + PPN 11%
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. Buat Custom Hook (cara gampang untuk memakai context)
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}