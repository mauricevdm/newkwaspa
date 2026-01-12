/**
 * API Provider Interface
 * Abstract interface that all backend providers must implement
 */

import type {
  Product,
  Category,
  Brand,
  Cart,
  CartItem,
  User,
  Order,
  CheckoutSession,
  ShippingMethod,
  PaymentMethod,
  Address,
  ProductQueryParams,
  PaginatedResult,
  AddToCartInput,
  UpdateCartItemInput,
  LoginInput,
  RegisterInput,
  AuthResponse,
  SetShippingAddressInput,
  SetBillingAddressInput,
  PlaceOrderInput,
  PlaceOrderResult,
} from './types';

// =============================================================================
// PROVIDER INTERFACE
// =============================================================================

export interface ApiProvider {
  readonly name: string;
  
  products: ProductsApi;
  categories: CategoriesApi;
  brands: BrandsApi;
  cart: CartApi;
  auth: AuthApi;
  checkout: CheckoutApi;
  orders: OrdersApi;
}

// =============================================================================
// PRODUCTS API
// =============================================================================

export interface ProductsApi {
  /**
   * Get paginated list of products with optional filters
   */
  getAll(params?: ProductQueryParams): Promise<PaginatedResult<Product>>;
  
  /**
   * Get a single product by slug
   */
  getBySlug(slug: string): Promise<Product | null>;
  
  /**
   * Get a single product by ID
   */
  getById(id: string): Promise<Product | null>;
  
  /**
   * Search products by query string
   */
  search(query: string, params?: ProductQueryParams): Promise<PaginatedResult<Product>>;
  
  /**
   * Get products by category
   */
  getByCategory(categorySlug: string, params?: ProductQueryParams): Promise<PaginatedResult<Product>>;
  
  /**
   * Get products by brand
   */
  getByBrand(brandSlug: string, params?: ProductQueryParams): Promise<PaginatedResult<Product>>;
  
  /**
   * Get featured/recommended products
   */
  getFeatured(limit?: number): Promise<Product[]>;
  
  /**
   * Get related products for a given product
   */
  getRelated(productId: string, limit?: number): Promise<Product[]>;
}

// =============================================================================
// CATEGORIES API
// =============================================================================

export interface CategoriesApi {
  /**
   * Get all categories as flat list
   */
  getAll(): Promise<Category[]>;
  
  /**
   * Get category tree (nested structure)
   */
  getTree(): Promise<Category[]>;
  
  /**
   * Get a single category by slug
   */
  getBySlug(slug: string): Promise<Category | null>;
  
  /**
   * Get a single category by ID
   */
  getById(id: string): Promise<Category | null>;
}

// =============================================================================
// BRANDS API
// =============================================================================

export interface BrandsApi {
  /**
   * Get all brands
   */
  getAll(): Promise<Brand[]>;
  
  /**
   * Get a single brand by slug
   */
  getBySlug(slug: string): Promise<Brand | null>;
  
  /**
   * Get a single brand by ID
   */
  getById(id: string): Promise<Brand | null>;
}

// =============================================================================
// CART API
// =============================================================================

export interface CartApi {
  /**
   * Get the current cart
   * For guests: uses localStorage cart ID
   * For logged-in users: fetches from server
   */
  get(): Promise<Cart>;
  
  /**
   * Add an item to the cart
   */
  addItem(input: AddToCartInput): Promise<Cart>;
  
  /**
   * Update cart item quantity
   */
  updateItem(input: UpdateCartItemInput): Promise<Cart>;
  
  /**
   * Remove an item from the cart
   */
  removeItem(itemId: string): Promise<Cart>;
  
  /**
   * Clear all items from the cart
   */
  clear(): Promise<Cart>;
  
  /**
   * Apply a coupon/discount code
   */
  applyCoupon(code: string): Promise<Cart>;
  
  /**
   * Remove applied coupon
   */
  removeCoupon(): Promise<Cart>;
  
  /**
   * Merge guest cart with user cart (called on login)
   */
  merge(guestCartId: string): Promise<Cart>;
}

// =============================================================================
// AUTH API
// =============================================================================

export interface AuthApi {
  /**
   * Login with email and password
   */
  login(input: LoginInput): Promise<AuthResponse>;
  
  /**
   * Register a new user
   */
  register(input: RegisterInput): Promise<AuthResponse>;
  
  /**
   * Logout current user
   */
  logout(): Promise<void>;
  
  /**
   * Get current authenticated user
   * Returns null if not authenticated
   */
  getUser(): Promise<User | null>;
  
  /**
   * Update user profile
   */
  updateUser(data: Partial<User>): Promise<User>;
  
  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  
  /**
   * Request password reset email
   */
  requestPasswordReset(email: string): Promise<void>;
  
  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;
  
  /**
   * Add a new address to user account
   */
  addAddress(address: Omit<Address, 'id'>): Promise<Address>;
  
  /**
   * Update an existing address
   */
  updateAddress(addressId: string, address: Partial<Address>): Promise<Address>;
  
  /**
   * Delete an address
   */
  deleteAddress(addressId: string): Promise<void>;
  
  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<AuthResponse>;
}

// =============================================================================
// CHECKOUT API
// =============================================================================

export interface CheckoutApi {
  /**
   * Initialize or get current checkout session
   */
  getSession(): Promise<CheckoutSession>;
  
  /**
   * Set customer email (for guest checkout)
   */
  setEmail(email: string): Promise<CheckoutSession>;
  
  /**
   * Set shipping address
   */
  setShippingAddress(input: SetShippingAddressInput): Promise<CheckoutSession>;
  
  /**
   * Set billing address
   */
  setBillingAddress(input: SetBillingAddressInput): Promise<CheckoutSession>;
  
  /**
   * Select shipping method
   */
  setShippingMethod(methodCode: string): Promise<CheckoutSession>;
  
  /**
   * Get available shipping methods for current address
   */
  getShippingMethods(): Promise<ShippingMethod[]>;
  
  /**
   * Get available payment methods
   */
  getPaymentMethods(): Promise<PaymentMethod[]>;
  
  /**
   * Place the order
   */
  placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult>;
}

// =============================================================================
// ORDERS API
// =============================================================================

export interface OrdersApi {
  /**
   * Get paginated list of user's orders
   */
  getAll(page?: number, pageSize?: number): Promise<PaginatedResult<Order>>;
  
  /**
   * Get a single order by ID
   */
  getById(orderId: string): Promise<Order | null>;
  
  /**
   * Get order by order number
   */
  getByOrderNumber(orderNumber: string): Promise<Order | null>;
  
  /**
   * Cancel an order (if allowed)
   */
  cancel(orderId: string): Promise<Order>;
  
  /**
   * Request a return/refund
   */
  requestReturn(orderId: string, items: { itemId: string; quantity: number; reason: string }[]): Promise<void>;
}

// =============================================================================
// PROVIDER CONFIG
// =============================================================================

export interface ProviderConfig {
  /** Base URL for API requests */
  baseUrl?: string;
  
  /** API key or access token */
  apiKey?: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Enable debug logging */
  debug?: boolean;
  
  /** Custom headers to include in all requests */
  headers?: Record<string, string>;

  /** Optional store view code (Magento) */
  storeCode?: string;
}

// =============================================================================
// PROVIDER FACTORY TYPE
// =============================================================================

export type ProviderFactory = (config?: ProviderConfig) => ApiProvider;
