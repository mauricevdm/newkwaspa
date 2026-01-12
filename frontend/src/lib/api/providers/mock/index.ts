/**
 * Mock Provider Implementation
 * 
 * Simulates a real backend with realistic delays and localStorage persistence.
 * Used for development, testing, and demo purposes.
 */

import type {
  ApiProvider,
  ProductsApi,
  CategoriesApi,
  BrandsApi,
  CartApi,
  AuthApi,
  CheckoutApi,
  OrdersApi,
  ProviderConfig,
} from '../../interface';
import type {
  Product,
  Category,
  Brand,
  Cart,
  CartItem,
  User,
  Address,
  Order,
  CheckoutSession,
  ShippingMethod,
  PaymentMethod,
  ProductQueryParams,
  PaginatedResult,
  AuthResponse,
  AddToCartInput,
  UpdateCartItemInput,
  LoginInput,
  RegisterInput,
} from '../../types';
import {
  mockProducts,
  mockCategories,
  mockBrands,
  mockUsers,
  verifyMockPassword,
  getMockUserByEmail,
  getMockUserById,
} from './data';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simulates network latency (200-500ms as per spec)
 */
function delay(min = 200, max = 500): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * LocalStorage keys
 */
const STORAGE_KEYS = {
  CART: 'dermastore_cart',
  AUTH_USER: 'dermastore_auth_user',
  ORDERS: 'dermastore_orders',
};

/**
 * Get cart from localStorage
 */
function getStoredCart(): Cart {
  if (typeof window === 'undefined') {
    return createEmptyCart();
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn('Failed to parse stored cart');
  }
  return createEmptyCart();
}

/**
 * Save cart to localStorage
 */
function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch {
    console.warn('Failed to save cart');
  }
}

/**
 * Create empty cart
 */
function createEmptyCart(): Cart {
  return {
    id: generateId('cart'),
    items: [],
    totals: {
      subtotal: { amount: 0, currency: 'ZAR', formatted: 'R0.00' },
      discount: { amount: 0, currency: 'ZAR', formatted: 'R0.00' },
      shipping: { amount: 0, currency: 'ZAR', formatted: 'R0.00' },
      tax: { amount: 0, currency: 'ZAR', formatted: 'R0.00' },
      total: { amount: 0, currency: 'ZAR', formatted: 'R0.00' },
    },
    itemCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Format price for display
 */
function formatPrice(amount: number): string {
  return `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * Recalculate cart totals
 */
function recalculateCart(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal.amount, 0);
  const tax = subtotal * 0.15; // 15% VAT
  const shipping = cart.items.length > 0 && subtotal < 500 ? 99 : 0; // Free shipping over R500
  const discount = (cart as any).appliedCoupons?.reduce((sum: number, c: any) => sum + (c.discount?.amount || 0), 0) || 0;
  const total = subtotal + tax + shipping - discount;

  return {
    ...cart,
    totals: {
      subtotal: { amount: subtotal, currency: 'ZAR', formatted: formatPrice(subtotal) },
      discount: { amount: discount, currency: 'ZAR', formatted: formatPrice(discount) },
      shipping: { amount: shipping, currency: 'ZAR', formatted: formatPrice(shipping) },
      tax: { amount: tax, currency: 'ZAR', formatted: formatPrice(tax) },
      total: { amount: total, currency: 'ZAR', formatted: formatPrice(total) },
    },
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get stored orders
 */
function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (stored) return JSON.parse(stored);
  } catch {
    console.warn('Failed to parse stored orders');
  }
  return [];
}

/**
 * Save orders to localStorage
 */
function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch {
    console.warn('Failed to save orders');
  }
}

// ============================================================================
// Mock Products API
// ============================================================================

const mockProductsApi: ProductsApi = {
  async getAll(params?: ProductQueryParams): Promise<PaginatedResult<Product>> {
    await delay();

    let filtered = [...mockProducts];

    // Filter by category
    if (params?.categorySlug) {
      filtered = filtered.filter((p) =>
        p.categories.some((c: Category) => c.slug === params.categorySlug)
      );
    }

    // Filter by brand
    if (params?.brandSlug) {
      filtered = filtered.filter(
        (p) => p.brand?.slug === params.brandSlug
      );
    }

    // Search
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand?.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    const sort = params?.sort || 'name-asc';
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sort) {
        case 'price-asc':
          comparison = a.price.amount - b.price.amount;
          break;
        case 'price-desc':
          comparison = b.price.amount - a.price.amount;
          break;
        case 'name-asc':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'name-desc':
          comparison = b.name.localeCompare(a.name);
          break;
        case 'newest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'oldest':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return comparison;
    });

    // Pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 12;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total,
      totalPages,
      page,
      pageSize,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  },

  async getBySlug(slug: string): Promise<Product | null> {
    await delay();
    return mockProducts.find((p) => p.slug === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    await delay();
    return mockProducts.find((p) => p.id === id) || null;
  },

  async search(query: string, params?: ProductQueryParams): Promise<PaginatedResult<Product>> {
    return this.getAll({ ...params, search: query });
  },

  async getByCategory(categorySlug: string, params?: ProductQueryParams): Promise<PaginatedResult<Product>> {
    return this.getAll({ ...params, categorySlug });
  },

  async getByBrand(brandSlug: string, params?: ProductQueryParams): Promise<PaginatedResult<Product>> {
    return this.getAll({ ...params, brandSlug });
  },

  async getRelated(productId: string, limit?: number): Promise<Product[]> {
    await delay();
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return [];

    // Find products in same category
    const related = mockProducts
      .filter((p) => p.id !== productId)
      .filter((p) => p.categories.some((c: Category) => product.categories.some((pc: Category) => pc.id === c.id)))
      .slice(0, limit || 4);

    return related;
  },

  async getFeatured(limit?: number): Promise<Product[]> {
    await delay();
    // Return products with highest ratings
    return [...mockProducts]
      .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
      .slice(0, limit || 8);
  },
};

// ============================================================================
// Mock Categories API
// ============================================================================

const mockCategoriesApi: CategoriesApi = {
  async getAll(): Promise<Category[]> {
    await delay();
    return mockCategories;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    await delay();
    return mockCategories.find((c) => c.slug === slug) || null;
  },

  async getById(id: string): Promise<Category | null> {
    await delay();
    return mockCategories.find((c) => c.id === id) || null;
  },

  async getTree(): Promise<Category[]> {
    await delay();
    // For now, all categories are at level 0
    // In a real implementation, this would build a nested tree
    return mockCategories;
  },
};

// ============================================================================
// Mock Brands API
// ============================================================================

const mockBrandsApi: BrandsApi = {
  async getAll(): Promise<Brand[]> {
    await delay();
    return mockBrands;
  },

  async getBySlug(slug: string): Promise<Brand | null> {
    await delay();
    return mockBrands.find((b) => b.slug === slug) || null;
  },

  async getById(id: string): Promise<Brand | null> {
    await delay();
    return mockBrands.find((b) => b.id === id) || null;
  },
};

// ============================================================================
// Mock Cart API
// ============================================================================

const mockCartApi: CartApi = {
  async get(): Promise<Cart> {
    await delay();
    return getStoredCart();
  },

  async addItem(input: { productId: string; quantity: number }): Promise<Cart> {
    await delay();

    const product = mockProducts.find((p) => p.id === input.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const cart = getStoredCart();
    const existingIndex = cart.items.findIndex((item) => item.productId === input.productId);

    if (existingIndex >= 0) {
      // Update existing item
      const existing = cart.items[existingIndex];
      const newQuantity = existing.quantity + input.quantity;
      cart.items[existingIndex] = {
        ...existing,
        quantity: newQuantity,
        subtotal: {
          amount: product.price.amount * newQuantity,
          currency: 'ZAR',
          formatted: formatPrice(product.price.amount * newQuantity),
        },
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        id: generateId('item'),
        productId: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || '',
        quantity: input.quantity,
        price: product.price,
        subtotal: {
          amount: product.price.amount * input.quantity,
          currency: 'ZAR',
          formatted: formatPrice(product.price.amount * input.quantity),
        },
      };
      cart.items.push(newItem);
    }

    const updatedCart = recalculateCart(cart);
    saveCart(updatedCart);
    return updatedCart;
  },

  async updateItem(input: { itemId: string; quantity: number }): Promise<Cart> {
    await delay();

    const cart = getStoredCart();
    const itemIndex = cart.items.findIndex((item) => item.id === input.itemId);

    if (itemIndex < 0) {
      throw new Error('Cart item not found');
    }

    if (input.quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      cart.items[itemIndex] = {
        ...item,
        quantity: input.quantity,
        subtotal: {
          amount: item.price.amount * input.quantity,
          currency: 'ZAR',
          formatted: formatPrice(item.price.amount * input.quantity),
        },
      };
    }

    const updatedCart = recalculateCart(cart);
    saveCart(updatedCart);
    return updatedCart;
  },

  async removeItem(itemId: string): Promise<Cart> {
    await delay();

    const cart = getStoredCart();
    cart.items = cart.items.filter((item) => item.id !== itemId);

    const updatedCart = recalculateCart(cart);
    saveCart(updatedCart);
    return updatedCart;
  },

  async clear(): Promise<Cart> {
    await delay();
    const emptyCart = createEmptyCart();
    saveCart(emptyCart);
    return emptyCart;
  },

  async applyCoupon(code: string): Promise<Cart> {
    await delay();

    const cart = getStoredCart();

    // Mock coupon codes
    const coupons: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
      SAVE10: { type: 'percentage', value: 10 },
      SAVE50: { type: 'fixed', value: 50 },
      WELCOME: { type: 'percentage', value: 15 },
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    const discountAmount =
      coupon.type === 'percentage'
        ? cart.totals.subtotal.amount * (coupon.value / 100)
        : coupon.value;

    // Store coupon on cart
    (cart as any).appliedCoupons = [
      {
        code: code.toUpperCase(),
        discount: {
          amount: discountAmount,
          currency: 'ZAR',
          formatted: formatPrice(discountAmount),
        },
      },
    ];

    const updatedCart = recalculateCart(cart);
    saveCart(updatedCart);
    return updatedCart;
  },

  async removeCoupon(): Promise<Cart> {
    await delay();

    const cart = getStoredCart();
    (cart as any).appliedCoupons = [];

    const updatedCart = recalculateCart(cart);
    saveCart(updatedCart);
    return updatedCart;
  },

  async merge(guestCartId: string): Promise<Cart> {
    await delay();
    // In mock, we just return the current cart
    // In real implementation, this would merge guest cart with user cart
    return getStoredCart();
  },
};

// ============================================================================
// Mock Auth API
// ============================================================================

// In-memory session storage (would be JWT in real implementation)
let currentSession: { userId: string; accessToken: string } | null = null;

const mockAuthApi: AuthApi = {
  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    await delay();

    if (!verifyMockPassword(input.email, input.password)) {
      throw new Error('Invalid email or password');
    }

    const mockUser = getMockUserByEmail(input.email);
    if (!mockUser) {
      throw new Error('User not found');
    }

    // Strip password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...user } = mockUser;

    const accessToken = `mock_access_${Date.now()}`;
    currentSession = { userId: user.id, accessToken };

    return { 
      user, 
      accessToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    };
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<AuthResponse> {
    await delay();

    // Check if email exists
    if (getMockUserByEmail(data.email)) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser: User = {
      id: generateId('user'),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const accessToken = `mock_access_${Date.now()}`;
    currentSession = { userId: newUser.id, accessToken };

    return { 
      user: newUser, 
      accessToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
  },

  async logout(): Promise<void> {
    await delay();
    currentSession = null;
  },

  async refreshToken(): Promise<AuthResponse> {
    await delay();

    if (!currentSession) {
      throw new Error('Not authenticated');
    }

    const user = getMockUserById(currentSession.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = `mock_access_${Date.now()}`;
    currentSession.accessToken = accessToken;

    return { 
      user, 
      accessToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
  },

  async getUser(): Promise<User | null> {
    await delay();

    if (!currentSession) return null;

    return getMockUserById(currentSession.userId) || null;
  },

  async updateUser(data: Partial<User>): Promise<User> {
    await delay();

    if (!currentSession) {
      throw new Error('Not authenticated');
    }

    const user = getMockUserById(currentSession.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In mock, we don't persist changes
    return {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  },

  async changePassword(): Promise<void> {
    await delay();

    if (!currentSession) {
      throw new Error('Not authenticated');
    }

    // Mock implementation - no actual password change
  },

  async requestPasswordReset(email: string): Promise<void> {
    await delay();

    // Check if user exists
    if (!getMockUserByEmail(email)) {
      // Don't reveal if email exists
      return;
    }

    // Mock implementation - no actual email sent
    console.log(`Password reset requested for: ${email}`);
  },

  async resetPassword(): Promise<void> {
    await delay();
    // Mock implementation - no actual password reset
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    await delay();

    return {
      ...address,
      id: generateId('addr'),
    };
  },

  async updateAddress(addressId: string, data: Partial<Address>): Promise<Address> {
    await delay();

    if (!currentSession) {
      throw new Error('Not authenticated');
    }

    const user = getMockUserById(currentSession.userId);
    const address = user?.addresses?.find((a) => a.id === addressId);

    if (!address) {
      throw new Error('Address not found');
    }

    return {
      ...address,
      ...data,
    };
  },

  async deleteAddress(addressId: string): Promise<void> {
    await delay();

    if (!currentSession) {
      throw new Error('Not authenticated');
    }

    // Mock implementation - no actual deletion
  },
};

// ============================================================================
// Mock Checkout API
// ============================================================================

const mockCheckoutApi: CheckoutApi = {
  async getSession(): Promise<CheckoutSession> {
    await delay();

    const cart = getStoredCart();

    return {
      id: generateId('checkout'),
      cart,
      step: 'information',
      availableShippingMethods: [
        {
          code: 'standard',
          name: 'Standard Delivery',
          description: '3-5 business days',
          price: { amount: 99, currency: 'ZAR', formatted: 'R99.00' },
          estimatedDays: '3-5 business days',
        },
        {
          code: 'express',
          name: 'Express Delivery',
          description: '1-2 business days',
          price: { amount: 199, currency: 'ZAR', formatted: 'R199.00' },
          estimatedDays: '1-2 business days',
        },
        {
          code: 'collection',
          name: 'Click & Collect',
          description: 'Collect from our store',
          price: { amount: 0, currency: 'ZAR', formatted: 'Free' },
          estimatedDays: '1 business day',
        },
      ],
      availablePaymentMethods: [
        {
          code: 'card',
          name: 'Credit/Debit Card',
          description: 'Visa, Mastercard, Amex',
          icon: '/images/payment/cards.svg',
        },
        {
          code: 'eft',
          name: 'EFT / Bank Transfer',
          description: 'Instant EFT via PayFast',
          icon: '/images/payment/eft.svg',
        },
        {
          code: 'snapscan',
          name: 'SnapScan',
          description: 'Pay with SnapScan',
          icon: '/images/payment/snapscan.svg',
        },
      ],
    };
  },

  async setEmail(email: string): Promise<CheckoutSession> {
    await delay();
    const cart = getStoredCart();

    return {
      id: generateId('checkout'),
      cart,
      email,
      step: 'shipping',
      availableShippingMethods: [],
      availablePaymentMethods: [],
    };
  },

  async setShippingAddress(input: { address: any }): Promise<CheckoutSession> {
    await delay();

    const cart = getStoredCart();

    return {
      id: generateId('checkout'),
      cart,
      shippingAddress: { id: generateId('addr'), ...input.address, isDefaultShipping: false, isDefaultBilling: false },
      step: 'shipping',
      availableShippingMethods: [],
      availablePaymentMethods: [],
    };
  },

  async setBillingAddress(input: { address?: any; sameAsShipping?: boolean }): Promise<CheckoutSession> {
    await delay();

    const cart = getStoredCart();

    return {
      id: generateId('checkout'),
      cart,
      billingAddress: input.address ? { id: generateId('addr'), ...input.address, isDefaultShipping: false, isDefaultBilling: false } : undefined,
      step: 'payment',
      availableShippingMethods: [],
      availablePaymentMethods: [],
    };
  },

  async setShippingMethod(methodCode: string): Promise<CheckoutSession> {
    await delay();

    const cart = getStoredCart();
    const methods: ShippingMethod[] = [
      {
        code: 'standard',
        name: 'Standard Delivery',
        description: '3-5 business days',
        price: { amount: 99, currency: 'ZAR', formatted: 'R99.00' },
        estimatedDays: '3-5 business days',
      },
      {
        code: 'express',
        name: 'Express Delivery',
        description: '1-2 business days',
        price: { amount: 199, currency: 'ZAR', formatted: 'R199.00' },
        estimatedDays: '1-2 business days',
      },
      {
        code: 'collection',
        name: 'Click & Collect',
        price: { amount: 0, currency: 'ZAR', formatted: 'Free' },
        estimatedDays: '1 business day',
      },
    ];

    const selectedMethod = methods.find((m) => m.code === methodCode);

    return {
      id: generateId('checkout'),
      cart,
      shippingMethod: selectedMethod,
      step: 'payment',
      availableShippingMethods: methods,
      availablePaymentMethods: [],
    };
  },

  async getShippingMethods(): Promise<ShippingMethod[]> {
    await delay();
    return [
      {
        code: 'standard',
        name: 'Standard Delivery',
        description: '3-5 business days',
        price: { amount: 99, currency: 'ZAR', formatted: 'R99.00' },
        estimatedDays: '3-5 business days',
      },
      {
        code: 'express',
        name: 'Express Delivery',
        description: '1-2 business days',
        price: { amount: 199, currency: 'ZAR', formatted: 'R199.00' },
        estimatedDays: '1-2 business days',
      },
    ];
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await delay();
    return [
      { code: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard' },
      { code: 'eft', name: 'EFT', description: 'Bank transfer' },
    ];
  },

  async placeOrder(input: { paymentMethodCode: string }): Promise<{ order: Order; redirectUrl?: string }> {
    await delay();

    const cart = getStoredCart();
    const user = currentSession ? getMockUserById(currentSession.userId) : null;

    const defaultAddress: Address = {
      id: 'temp',
      firstName: 'Guest',
      lastName: 'User',
      street: ['123 Test Street'],
      city: 'Cape Town',
      region: 'Western Cape',
      postcode: '8001',
      country: 'South Africa',
      countryCode: 'ZA',
      isDefaultShipping: true,
      isDefaultBilling: true,
    };

    const order: Order = {
      id: generateId('order'),
      orderNumber: `DS${Date.now().toString().slice(-8)}`,
      status: 'pending',
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      totals: cart.totals,
      shippingAddress: user?.addresses?.[0] || defaultAddress,
      billingAddress: user?.addresses?.[0] || defaultAddress,
      paymentMethod: { code: input.paymentMethodCode, name: 'Credit Card' },
      shippingMethod: {
        code: 'standard',
        name: 'Standard Delivery',
        price: { amount: 99, currency: 'ZAR', formatted: 'R99.00' },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order
    const orders = getStoredOrders();
    orders.push(order);
    saveOrders(orders);

    // Clear cart
    saveCart(createEmptyCart());

    return { order };
  },
};

// ============================================================================
// Mock Orders API
// ============================================================================

const mockOrdersApi: OrdersApi = {
  async getAll(page?: number, pageSize?: number): Promise<PaginatedResult<Order>> {
    await delay();

    const orders = getStoredOrders();
    const actualPage = page || 1;
    const actualPageSize = pageSize || 10;

    return {
      items: orders,
      total: orders.length,
      totalPages: 1,
      page: actualPage,
      pageSize: actualPageSize,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  },

  async getById(id: string): Promise<Order | null> {
    await delay();

    const orders = getStoredOrders();
    return orders.find((o) => o.id === id) || null;
  },

  async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    await delay();

    const orders = getStoredOrders();
    return orders.find((o) => o.orderNumber === orderNumber) || null;
  },

  async cancel(orderId: string): Promise<Order> {
    await delay();

    const orders = getStoredOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex < 0) {
      throw new Error('Order not found');
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    };

    saveOrders(orders);
    return orders[orderIndex];
  },

  async requestReturn(): Promise<void> {
    await delay();
    // Mock implementation - no actual return request
  },
};

// ============================================================================
// Mock Provider Factory
// ============================================================================

export function createMockProvider(config?: ProviderConfig): ApiProvider {
  console.log('Mock API Provider initialized', config);

  return {
    name: 'mock',
    products: mockProductsApi,
    categories: mockCategoriesApi,
    brands: mockBrandsApi,
    cart: mockCartApi,
    auth: mockAuthApi,
    checkout: mockCheckoutApi,
    orders: mockOrdersApi,
  };
}

// Default export
export const mockProvider = createMockProvider();
export default mockProvider;
