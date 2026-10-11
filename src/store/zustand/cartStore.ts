import { create } from 'zustand';

import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  /** Re-read the cart from storage (called after async hydrateStorage()). */
  rehydrate: () => void;
}

const persist = (items: CartItem[]) => storage.setObject(STORAGE_KEYS.cart, items);
const saved = storage.getObject<CartItem[]>(STORAGE_KEYS.cart) ?? [];

export const useCartStore = create<CartState>((set, get) => ({
  items: saved,

  add: (item, qty = 1) => {
    const items = [...get().items];
    const existing = items.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({ ...item, quantity: qty });
    }
    persist(items);
    set({ items });
  },

  remove: (productId) => {
    const items = get().items.filter((i) => i.productId !== productId);
    persist(items);
    set({ items });
  },

  setQty: (productId, qty) => {
    if (qty <= 0) {
      get().remove(productId);
      return;
    }
    const items = get().items.map((i) =>
      i.productId === productId ? { ...i, quantity: qty } : i,
    );
    persist(items);
    set({ items });
  },

  increment: (productId) => get().setQty(productId, (find(get().items, productId)?.quantity ?? 0) + 1),
  decrement: (productId) => get().setQty(productId, (find(get().items, productId)?.quantity ?? 0) - 1),

  clear: () => {
    persist([]);
    set({ items: [] });
  },

  rehydrate: () => set({ items: storage.getObject<CartItem[]>(STORAGE_KEYS.cart) ?? [] }),
}));

function find(items: CartItem[], id: string) {
  return items.find((i) => i.productId === id);
}

/* ------------------------------- selectors -------------------------------- */

export const selectCartCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);

export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + (i.unitPrice ?? 0) * i.quantity, 0);

export const selectHasQuoteOnly = (s: CartState) => s.items.some((i) => i.quoteOnly);

export const useCartCount = () => useCartStore(selectCartCount);
export const useCartSubtotal = () => useCartStore(selectCartSubtotal);
