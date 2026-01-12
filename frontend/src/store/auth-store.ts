import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, _password) => {
        set({ isLoading: true });

        // Mock auth: in real implementation, call `api.auth.login({ email, password })`.
        await new Promise((resolve) => setTimeout(resolve, 300));

        const localPart = email.split('@')[0] || 'User';
        const firstName = localPart.charAt(0).toUpperCase() + localPart.slice(1);
        const user: User = {
          id: `user_${Math.random().toString(36).slice(2, 10)}`,
          email,
          firstName,
          lastName: '',
        };

        set({
          user,
          token: 'mock-token',
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'dermastore-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
