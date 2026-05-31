import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { ApiError } from '@/lib/api';
import { User, AuthResponse } from '@/types';
 
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
 
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: string) => Promise<User>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: () => boolean;
  hasRole: (...roles: string[]) => boolean;
}
 
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
 
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.post<AuthResponse>('/auth/login', { email, password });
          // Store token in localStorage for api.ts to pick up
          localStorage.setItem('lf_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data.user;
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Login failed.';
          set({ isLoading: false, error: msg });
          throw err;
        }
      },
 
      register: async (name, email, password, role = 'borrower') => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.post<AuthResponse>('/auth/register', {
            name, email, password, role,
          });
          localStorage.setItem('lf_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data.user;
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Registration failed.';
          set({ isLoading: false, error: msg });
          throw err;
        }
      },
 
      logout: () => {
        localStorage.removeItem('lf_token');
        set({ user: null, token: null, error: null });
      },
 
      clearError: () => set({ error: null }),
 
      isAuthenticated: () => !!get().token && !!get().user,
 
      hasRole: (...roles) => {
        const role = get().user?.role;
        return !!role && (role === 'admin' || roles.includes(role));
      },
    }),
    {
      name: 'lf-auth',
      // Only persist user + token; don't persist loading/error state
      partialize: (state) => ({ user: state.user, token: state.token }),
      // Re-sync localStorage token on rehydration
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          localStorage.setItem('lf_token', state.token);
        }
      },
    }
  )
);
 
export default useAuthStore;