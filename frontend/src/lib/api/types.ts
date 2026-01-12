/**
 * Unified API Types
 * Backend-agnostic type definitions for the e-commerce platform
 */

// =============================================================================
// PRODUCT TYPES
// =============================================================================

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: Price;
  images: ProductImage[];
  brand: Brand;
  categories: Category[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  stock: StockStatus;
  rating?: Rating;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Price {
  amount: number;
  currency: string;
  compareAtAmount?: number; // Original price if on sale
  formatted: string;
  compareAtFormatted?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isDefault: boolean;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  image?: string;
  description?: string;
  productCount?: number;
}

export interface ProductAttribute {
  name: string;
  code: string;
  value: string;
  displayValue?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: Price;
  attributes: ProductAttribute[];
  stock: StockStatus;
  image?: ProductImage;
}

export interface StockStatus {
  inStock: boolean;
  quantity?: number;
  lowStockThreshold?: number;
  backorderAllowed?: boolean;
}

export interface Rating {
  average: number;
  count: number;
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
  level: number;
  path: string[];
}

// =============================================================================
// CART TYPES
// =============================================================================

export interface Cart {
  id: string;
  items: CartItem[];
  totals: CartTotals;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  name: string;
  slug: string;
  image: string;
  price: Price;
  quantity: number;
  subtotal: Price;
  attributes?: ProductAttribute[];
}

export interface CartTotals {
  subtotal: Price;
  discount: Price;
  shipping: Price;
  tax: Price;
  total: Price;
}

export interface AddToCartInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  itemId: string;
  quantity: number;
}

// =============================================================================
// USER & AUTH TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string[];
  city: string;
  region: string;
  regionCode?: string;
  postcode: string;
  country: string;
  countryCode: string;
  phone?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string; // Only returned if not using httpOnly cookies
  expiresAt?: string;
}

// =============================================================================
// ORDER TYPES
// =============================================================================

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  totals: CartTotals;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  image: string;
  price: Price;
  quantity: number;
  subtotal: Price;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface ShippingMethod {
  code: string;
  name: string;
  description?: string;
  price: Price;
  estimatedDays?: string;
}

export interface PaymentMethod {
  code: string;
  name: string;
  description?: string;
  icon?: string;
}

// =============================================================================
// CHECKOUT TYPES
// =============================================================================

export interface CheckoutSession {
  id: string;
  cart: Cart;
  email?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingMethod?: ShippingMethod;
  paymentMethod?: PaymentMethod;
  availableShippingMethods: ShippingMethod[];
  availablePaymentMethods: PaymentMethod[];
  step: CheckoutStep;
}

export type CheckoutStep = 
  | 'information'
  | 'shipping'
  | 'payment'
  | 'review';

export interface SetShippingAddressInput {
  address: Omit<Address, 'id' | 'isDefaultShipping' | 'isDefaultBilling'>;
  saveToAccount?: boolean;
}

export interface SetBillingAddressInput {
  address: Omit<Address, 'id' | 'isDefaultShipping' | 'isDefaultBilling'>;
  sameAsShipping?: boolean;
  saveToAccount?: boolean;
}

export interface PlaceOrderInput {
  paymentMethodCode: string;
  paymentData?: Record<string, unknown>;
}

export interface PlaceOrderResult {
  order: Order;
  redirectUrl?: string; // For payment gateway redirects
}

// =============================================================================
// QUERY TYPES
// =============================================================================

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  sort?: ProductSortOption;
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  attributes?: Record<string, string[]>;
}

export type ProductSortOption = 
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'best-selling'
  | 'rating';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export class ApiException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
    public readonly field?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
