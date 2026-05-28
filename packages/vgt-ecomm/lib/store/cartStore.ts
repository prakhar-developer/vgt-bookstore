import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
  quantity: number;
  inStock?: boolean;
}

interface CartState {
  items: CartItem[];
  sessionId: string;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  removeItem: (bookId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server-session';
  }

  const storageKey = 'vgt-cart-session-id';
  const existing = window.localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const nextId = crypto.randomUUID();
  window.localStorage.setItem(storageKey, nextId);
  return nextId;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: getOrCreateSessionId(),
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((cartItem) => cartItem.bookId === item.bookId);

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.bookId === item.bookId
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity }],
          };
        }),
      updateQuantity: (bookId, quantity) =>
        set((state) => ({
          items: state.items
            .map((cartItem) =>
              cartItem.bookId === bookId
                ? { ...cartItem, quantity }
                : cartItem
            )
            .filter((cartItem) => cartItem.quantity > 0),
        })),
      removeItem: (bookId) =>
        set((state) => ({
          items: state.items.filter((cartItem) => cartItem.bookId !== bookId),
        })),
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'vgt-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          state.sessionId = getOrCreateSessionId();
        }
      },
    }
  )
);