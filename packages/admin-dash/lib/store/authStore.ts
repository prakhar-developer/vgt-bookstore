import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (admin: Admin, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      setAuth: (admin, token) =>
        set({ admin, token, isAuthenticated: true }),
      logout: () =>
        set({ admin: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'vgt-admin-auth',
    }
  )
);
