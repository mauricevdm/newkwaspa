import { create } from 'zustand';

interface UIState {
  // Modals
  searchModalOpen: boolean;
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  quickViewProductId: string | null;
  
  // Filters
  filterPanelOpen: boolean;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  setSearchModalOpen: (open: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setQuickViewProductId: (productId: string | null) => void;
  setFilterPanelOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Initial state
  searchModalOpen: false,
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  quickViewProductId: null,
  filterPanelOpen: false,
  theme: 'light',

  // Actions
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setQuickViewProductId: (productId) => set({ quickViewProductId: productId }),
  setFilterPanelOpen: (open) => set({ filterPanelOpen: open }),
  setTheme: (theme) => set({ theme }),

  closeAllModals: () =>
    set({
      searchModalOpen: false,
      cartDrawerOpen: false,
      mobileMenuOpen: false,
      quickViewProductId: null,
      filterPanelOpen: false,
    }),
}));
