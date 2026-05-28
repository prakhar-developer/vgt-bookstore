import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'guest' | 'registered';
  orderCount: number;
}

interface CustomerAuthState {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (customer: Customer, token: string) => void;
  logout: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      customer: null,
      token: null,
      isAuthenticated: false,
      setAuth: (customer, token) => set({ customer, token, isAuthenticated: true }),
      logout: () => set({ customer: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'vgt-customer-auth',
    }
  )
);