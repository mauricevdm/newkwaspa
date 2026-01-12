/**
 * React Query Hooks for API Layer
 * 
 * Provides cached, reactive data fetching with automatic revalidation.
 * Uses TanStack Query (React Query) for state management.
 * 
 * Usage:
 * ```tsx
 * import { useProducts, useProduct, useCart, useAuth } from '@/lib/api/hooks';
 * 
 * function ProductList() {
 *   const { data, isLoading, error } = useProducts({ categoryId: 'serums' });
 *   if (isLoading) return <Spinner />;
 *   return <Grid>{data?.items.map(p => <ProductCard key={p.id} product={p} />)}</Grid>;
 * }
 * ```
 */

'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { api } from './index';
import type {
  Product,
  Category,
  Brand,
  Cart,
  User,
  Order,
  ProductQueryParams,
  PaginatedResult,
  Address,
  AuthResponse,
  AddToCartInput,
  UpdateCartItemInput,
} from './types';

// ============================================================================
// Query Keys
// ============================================================================

export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    list: (params?: ProductQueryParams) => [...queryKeys.products.all, 'list', params] as const,
    detail: (slug: string) => [...queryKeys.products.all, 'detail', slug] as const,
    related: (productId: string) => [...queryKeys.products.all, 'related', productId] as const,
    featured: () => [...queryKeys.products.all, 'featured'] as const,
  },
  // Categories
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.categories.all, 'detail', slug] as const,
    tree: () => [...queryKeys.categories.all, 'tree'] as const,
  },
  // Brands
  brands: {
    all: ['brands'] as const,
    list: () => [...queryKeys.brands.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.brands.all, 'detail', slug] as const,
  },
  // Cart
  cart: {
    all: ['cart'] as const,
    current: () => [...queryKeys.cart.all, 'current'] as const,
  },
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  // Orders
  orders: {
    all: ['orders'] as const,
    list: (params?: { page?: number }) => [...queryKeys.orders.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },
};

// ============================================================================
// Products Hooks
// ============================================================================

/**
 * Fetch paginated product list with filtering and sorting
 */
export function useProducts(
  params?: ProductQueryParams,
  options?: Omit<UseQueryOptions<PaginatedResult<Product>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => api.products.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Fetch single product by slug
 */
export function useProduct(
  slug: string,
  options?: Omit<UseQueryOptions<Product | null>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => api.products.getBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
}

/**
 * Fetch related products
 */
export function useRelatedProducts(
  productId: string,
  limit?: number,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.related(productId),
    queryFn: () => api.products.getRelated(productId, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
    ...options,
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts(
  limit?: number,
  options?: Omit<UseQueryOptions<Product[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => api.products.getFeatured(limit),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// ============================================================================
// Categories Hooks
// ============================================================================

/**
 * Fetch all categories
 */
export function useCategories(
  options?: Omit<UseQueryOptions<Category[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => api.categories.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change rarely
    ...options,
  });
}

/**
 * Fetch single category by slug
 */
export function useCategory(
  slug: string,
  options?: Omit<UseQueryOptions<Category | null>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => api.categories.getBySlug(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
}

/**
 * Fetch category tree (nested structure)
 */
export function useCategoryTree(
  options?: Omit<UseQueryOptions<Category[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn: () => api.categories.getTree(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

// ============================================================================
// Brands Hooks
// ============================================================================

/**
 * Fetch all brands
 */
export function useBrands(
  options?: Omit<UseQueryOptions<Brand[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: () => api.brands.getAll(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Fetch single brand by slug
 */
export function useBrand(
  slug: string,
  options?: Omit<UseQueryOptions<Brand | null>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.brands.detail(slug),
    queryFn: () => api.brands.getBySlug(slug),
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
}

// ============================================================================
// Cart Hooks
// ============================================================================

/**
 * Fetch current cart
 */
export function useCart(
  options?: Omit<UseQueryOptions<Cart>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: () => api.cart.get(),
    staleTime: 0, // Always refetch cart
    refetchOnWindowFocus: true,
    ...options,
  });
}

/**
 * Add item to cart mutation
 */
export function useAddToCart(
  options?: UseMutationOptions<Cart, Error, AddToCartInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => api.cart.addItem(input),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
    ...options,
  });
}

/**
 * Update cart item quantity mutation
 */
export function useUpdateCartItem(
  options?: UseMutationOptions<Cart, Error, UpdateCartItemInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => api.cart.updateItem(input),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
    ...options,
  });
}

/**
 * Remove item from cart mutation
 */
export function useRemoveFromCart(
  options?: UseMutationOptions<Cart, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => api.cart.removeItem(itemId),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
    ...options,
  });
}

/**
 * Clear cart mutation
 */
export function useClearCart(options?: UseMutationOptions<Cart, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.cart.clear(),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
    ...options,
  });
}

/**
 * Apply coupon mutation
 */
export function useApplyCoupon(options?: UseMutationOptions<Cart, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code) => api.cart.applyCoupon(code),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
    ...options,
  });
}

/**
 * Remove coupon mutation
 */
export function useRemoveCoupon(options?: UseMutationOptions<Cart, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.cart.removeCoupon(),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.current(), cart);
    },
    ...options,
  });
}

// ============================================================================
// Auth Hooks
// ============================================================================

/**
 * Get current authenticated user
 */
export function useCurrentUser(
  options?: Omit<UseQueryOptions<User | null>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => api.auth.getUser(),
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on auth failure
    ...options,
  });
}

/**
 * Login mutation
 */
export function useLogin(
  options?: UseMutationOptions<
    AuthResponse,
    Error,
    { email: string; password: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => api.auth.login({ email, password }),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.user(), user);
      // Refetch cart after login (may have merged)
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
    ...options,
  });
}

/**
 * Register mutation
 */
export function useRegister(
  options?: UseMutationOptions<
    AuthResponse,
    Error,
    {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.auth.register(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.user(), user);
    },
    ...options,
  });
}

/**
 * Logout mutation
 */
export function useLogout(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.user(), null);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
    ...options,
  });
}

/**
 * Update profile mutation
 */
export function useUpdateProfile(
  options?: UseMutationOptions<User, Error, Partial<User>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.auth.updateUser(data),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.user(), user);
    },
    ...options,
  });
}

/**
 * Change password mutation
 */
export function useChangePassword(
  options?: UseMutationOptions<
    void,
    Error,
    { currentPassword: string; newPassword: string }
  >
) {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      api.auth.changePassword(currentPassword, newPassword),
    ...options,
  });
}

/**
 * Request password reset mutation
 */
export function useRequestPasswordReset(
  options?: UseMutationOptions<void, Error, string>
) {
  return useMutation({
    mutationFn: (email) => api.auth.requestPasswordReset(email),
    ...options,
  });
}

/**
 * Add address mutation
 */
export function useAddAddress(
  options?: UseMutationOptions<Address, Error, Omit<Address, 'id'>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address) => api.auth.addAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
    ...options,
  });
}

/**
 * Update address mutation
 */
export function useUpdateAddress(
  options?: UseMutationOptions<
    Address,
    Error,
    { addressId: string; data: Partial<Address> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, data }) => api.auth.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
    ...options,
  });
}

/**
 * Delete address mutation
 */
export function useDeleteAddress(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId) => api.auth.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
    ...options,
  });
}

// ============================================================================
// Orders Hooks
// ============================================================================

/**
 * Fetch user orders
 */
export function useOrders(
  params?: { page?: number; pageSize?: number },
  options?: Omit<UseQueryOptions<PaginatedResult<Order>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => api.orders.getAll(params?.page, params?.pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Fetch single order by ID
 */
export function useOrder(
  id: string,
  options?: Omit<UseQueryOptions<Order | null>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => api.orders.getById(id),
    staleTime: 2 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
}

/**
 * Cancel order mutation
 */
export function useCancelOrder(options?: UseMutationOptions<Order, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId) => api.orders.cancel(orderId),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });
    },
    ...options,
  });
}

// ============================================================================
// Export All
// ============================================================================

export default {
  // Query keys
  queryKeys,
  // Products
  useProducts,
  useProduct,
  useRelatedProducts,
  useFeaturedProducts,
  // Categories
  useCategories,
  useCategory,
  useCategoryTree,
  // Brands
  useBrands,
  useBrand,
  // Cart
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
  useApplyCoupon,
  useRemoveCoupon,
  // Auth
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
  useChangePassword,
  useRequestPasswordReset,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  // Orders
  useOrders,
  useOrder,
  useCancelOrder,
};
