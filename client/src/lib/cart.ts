import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@shared/schema";

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: (products: Product[]) => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId: string, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === productId
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        });
      },
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotal: (products: Product[]) => {
        return get().items.reduce((total, item) => {
          const product = products.find((p) => p.id === item.productId);
          return total + (product?.price || 0) * item.quantity;
        }, 0);
      },
    }),
    {
      name: "afrishop-cart",
    }
  )
);

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}
