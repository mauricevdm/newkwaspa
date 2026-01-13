/**
 * Magento Provider Implementation
 * 
 * Wraps the existing Magento GraphQL client and maps responses to our unified API types.
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
  User,
  Address,
  Order,
  CheckoutSession,
  ProductQueryParams,
  PaginatedResult,
  LoginInput,
  RegisterInput,
  AuthResponse,
  AddToCartInput,
  UpdateCartItemInput,
  SetShippingAddressInput,
  SetBillingAddressInput,
  PlaceOrderInput,
  PlaceOrderResult,
  ShippingMethod,
  PaymentMethod,
} from '../../types';
import {
  mapProduct,
  mapCategory,
  mapCart,
  mapUser,
  mapOrder,
  mapPaginatedProducts,
} from './mappers';

// ============================================================================
// Magento GraphQL Client
// ============================================================================

interface MagentoConfig {
  apiUrl: string;
  graphqlUrl: string;
  storeCode?: string;
}

class MagentoGraphQLClient {
  private config: MagentoConfig;
  private token: string | null = null;
  private cartId: string | null = null;

  constructor(config: MagentoConfig) {
    this.config = config;
    // Restore cart ID from localStorage if available
    if (typeof window !== 'undefined') {
      this.cartId = localStorage.getItem('magento_cart_id');
    }
  }

  async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.storeCode) {
      headers['Store'] = this.config.storeCode;
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(this.config.graphqlUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors) {
      const error = result.errors[0];
      throw new Error(error.message || 'GraphQL Error');
    }

    return result.data;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('magento_token', token);
      } else {
        localStorage.removeItem('magento_token');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('magento_token');
    }
    return this.token;
  }

  setCartId(cartId: string | null) {
    this.cartId = cartId;
    if (typeof window !== 'undefined') {
      if (cartId) {
        localStorage.setItem('magento_cart_id', cartId);
      } else {
        localStorage.removeItem('magento_cart_id');
      }
    }
  }

  getCartId(): string | null {
    if (this.cartId) return this.cartId;
    if (typeof window !== 'undefined') {
      this.cartId = localStorage.getItem('magento_cart_id');
    }
    return this.cartId;
  }
}

// ============================================================================
// GraphQL Queries
// ============================================================================

const QUERIES = {
  GET_PRODUCTS: `
    query GetProducts(
      $pageSize: Int
      $currentPage: Int
      $filter: ProductAttributeFilterInput
      $sort: ProductAttributeSortInput
      $search: String
    ) {
      products(
        pageSize: $pageSize
        currentPage: $currentPage
        filter: $filter
        sort: $sort
        search: $search
      ) {
        total_count
        items {
          id
          sku
          name
          url_key
          description { html }
          short_description { html }
          price_range {
            minimum_price {
              regular_price { value currency }
              final_price { value currency }
              discount { amount_off percent_off }
            }
          }
          image { url label }
          thumbnail { url label }
          media_gallery { url label position }
          rating_summary
          review_count
          stock_status
          categories { id name url_key }
        }
        page_info {
          current_page
          page_size
          total_pages
        }
      }
    }
  `,

  GET_PRODUCT: `
    query GetProduct($urlKey: String!) {
      products(filter: { url_key: { eq: $urlKey } }) {
        items {
          id
          sku
          name
          url_key
          description { html }
          short_description { html }
          price_range {
            minimum_price {
              regular_price { value currency }
              final_price { value currency }
              discount { amount_off percent_off }
            }
          }
          media_gallery { url label position }
          rating_summary
          review_count
          stock_status
          meta_title
          meta_description
          categories { id name url_key }
        }
      }
    }
  `,

  GET_CATEGORIES: `
    query GetCategories {
      categories {
        items {
          id
          name
          url_key
          image
          description
          product_count
          level
          children {
            id
            name
            url_key
            image
            product_count
            children {
              id
              name
              url_key
              product_count
            }
          }
        }
      }
    }
  `,

  GET_CART: `
    query GetCart($cartId: String!) {
      cart(cart_id: $cartId) {
        id
        email
        items {
          id
          product {
            id
            sku
            name
            url_key
            thumbnail { url }
          }
          quantity
          prices {
            row_total { value currency }
            price { value currency }
          }
        }
        prices {
          subtotal_excluding_tax { value currency }
          subtotal_including_tax { value currency }
          grand_total { value currency }
          discounts { amount { value currency } label }
        }
        applied_coupons { code }
        shipping_addresses {
          selected_shipping_method {
            carrier_title
            method_title
            amount { value currency }
          }
        }
      }
    }
  `,

  GET_CUSTOMER: `
    query GetCustomer {
      customer {
        id
        email
        firstname
        lastname
        addresses {
          id
          firstname
          lastname
          company
          street
          city
          region { region_code region }
          postcode
          country_code
          telephone
          default_billing
          default_shipping
        }
      }
    }
  `,

  GET_CUSTOMER_ORDERS: `
    query GetCustomerOrders($pageSize: Int, $currentPage: Int) {
      customer {
        orders(pageSize: $pageSize, currentPage: $currentPage) {
          total_count
          items {
            id
            order_number
            order_date
            status
            items {
              id
              product_sku
              product_name
              product_url_key
              quantity_ordered
              status
              product_sale_price { value currency }
            }
            total {
              subtotal { value currency }
              taxes { amount { value currency } title }
              discounts { amount { value currency } label }
              shipping_handling { value currency }
              grand_total { value currency }
            }
            shipping_address {
              firstname
              lastname
              street
              city
              region { region_code region }
              postcode
              country_code
              telephone
            }
            billing_address {
              firstname
              lastname
              street
              city
              region { region_code region }
              postcode
              country_code
              telephone
            }
            payment_methods { name type }
            shipping_method
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
    }
  `,
};

const MUTATIONS = {
  CREATE_EMPTY_CART: `
    mutation CreateEmptyCart {
      createEmptyCart
    }
  `,

  CREATE_CUSTOMER_CART: `
    mutation {
      customerCart {
        id
      }
    }
  `,

  ADD_TO_CART: `
    mutation AddToCart($cartId: String!, $sku: String!, $quantity: Float!) {
      addSimpleProductsToCart(
        input: {
          cart_id: $cartId
          cart_items: [{ data: { sku: $sku, quantity: $quantity } }]
        }
      ) {
        cart {
          id
          items { id quantity }
        }
      }
    }
  `,

  UPDATE_CART_ITEM: `
    mutation UpdateCartItem($cartId: String!, $itemId: Int!, $quantity: Float!) {
      updateCartItems(
        input: {
          cart_id: $cartId
          cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
        }
      ) {
        cart {
          id
          items { id quantity }
        }
      }
    }
  `,

  REMOVE_FROM_CART: `
    mutation RemoveFromCart($cartId: String!, $itemId: Int!) {
      removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId }) {
        cart {
          id
          items { id }
        }
      }
    }
  `,

  APPLY_COUPON: `
    mutation ApplyCoupon($cartId: String!, $couponCode: String!) {
      applyCouponToCart(input: { cart_id: $cartId, coupon_code: $couponCode }) {
        cart {
          applied_coupons { code }
        }
      }
    }
  `,

  REMOVE_COUPON: `
    mutation RemoveCoupon($cartId: String!) {
      removeCouponFromCart(input: { cart_id: $cartId }) {
        cart {
          applied_coupons { code }
        }
      }
    }
  `,

  GENERATE_TOKEN: `
    mutation GenerateToken($email: String!, $password: String!) {
      generateCustomerToken(email: $email, password: $password) {
        token
      }
    }
  `,

  CREATE_CUSTOMER: `
    mutation CreateCustomer($input: CustomerCreateInput!) {
      createCustomerV2(input: $input) {
        customer {
          id
          email
          firstname
          lastname
        }
      }
    }
  `,

  UPDATE_CUSTOMER: `
    mutation UpdateCustomer($input: CustomerUpdateInput!) {
      updateCustomerV2(input: $input) {
        customer {
          id
          email
          firstname
          lastname
        }
      }
    }
  `,

  CHANGE_PASSWORD: `
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
      changeCustomerPassword(
        currentPassword: $currentPassword
        newPassword: $newPassword
      ) {
        email
      }
    }
  `,

  REQUEST_PASSWORD_RESET: `
    mutation RequestPasswordReset($email: String!) {
      requestPasswordResetEmail(email: $email)
    }
  `,

  RESET_PASSWORD: `
    mutation ResetPassword($email: String!, $resetPasswordToken: String!, $newPassword: String!) {
      resetPassword(
        email: $email
        resetPasswordToken: $resetPasswordToken
        newPassword: $newPassword
      )
    }
  `,

  CREATE_ADDRESS: `
    mutation CreateAddress($input: CustomerAddressInput!) {
      createCustomerAddress(input: $input) {
        id
        firstname
        lastname
        street
        city
        region { region_code }
        postcode
        country_code
        telephone
      }
    }
  `,

  UPDATE_ADDRESS: `
    mutation UpdateAddress($id: Int!, $input: CustomerAddressInput!) {
      updateCustomerAddress(id: $id, input: $input) {
        id
        firstname
        lastname
      }
    }
  `,

  DELETE_ADDRESS: `
    mutation DeleteAddress($id: Int!) {
      deleteCustomerAddress(id: $id)
    }
  `,

  MERGE_CARTS: `
    mutation MergeCarts($sourceCartId: String!, $destinationCartId: String!) {
      mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId) {
        id
        items { id }
      }
    }
  `,

  SET_SHIPPING_ADDRESS: `
    mutation SetShippingAddress($cartId: String!, $address: CartAddressInput!) {
      setShippingAddressesOnCart(
        input: { cart_id: $cartId, shipping_addresses: [{ address: $address }] }
      ) {
        cart {
          shipping_addresses {
            firstname
            lastname
          }
        }
      }
    }
  `,

  SET_BILLING_ADDRESS: `
    mutation SetBillingAddress($cartId: String!, $address: CartAddressInput!) {
      setBillingAddressOnCart(
        input: { cart_id: $cartId, billing_address: { address: $address } }
      ) {
        cart {
          billing_address {
            firstname
            lastname
          }
        }
      }
    }
  `,

  SET_SHIPPING_METHOD: `
    mutation SetShippingMethod($cartId: String!, $carrierCode: String!, $methodCode: String!) {
      setShippingMethodsOnCart(
        input: {
          cart_id: $cartId
          shipping_methods: [{ carrier_code: $carrierCode, method_code: $methodCode }]
        }
      ) {
        cart {
          shipping_addresses {
            selected_shipping_method {
              carrier_title
              method_title
            }
          }
        }
      }
    }
  `,

  SET_PAYMENT_METHOD: `
    mutation SetPaymentMethod($cartId: String!, $code: String!) {
      setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: $code } }) {
        cart {
          selected_payment_method {
            code
            title
          }
        }
      }
    }
  `,

  PLACE_ORDER: `
    mutation PlaceOrder($cartId: String!) {
      placeOrder(input: { cart_id: $cartId }) {
        order {
          order_number
        }
      }
    }
  `,

  REVOKE_TOKEN: `
    mutation RevokeToken {
      revokeCustomerToken {
        result
      }
    }
  `,
};

// ============================================================================
// Magento Products API
// ============================================================================

function createProductsApi(client: MagentoGraphQLClient): ProductsApi {
  return {
    async getAll(params?: ProductQueryParams): Promise<PaginatedResult<Product>> {
      const variables: Record<string, unknown> = {
        pageSize: params?.pageSize || 12,
        currentPage: params?.page || 1,
      };

      // Build filter
      const filter: Record<string, unknown> = {};
      if (Object.keys(filter).length > 0) {
        variables.filter = filter;
      }

      if (params?.search) {
        variables.search = params.search;
      }

      // Build sort (best-effort mapping)
      if (params?.sort) {
        switch (params.sort) {
          case 'newest':
            variables.sort = { created_at: 'DESC' };
            break;
          case 'oldest':
            variables.sort = { created_at: 'ASC' };
            break;
          case 'price-asc':
            variables.sort = { price: 'ASC' };
            break;
          case 'price-desc':
            variables.sort = { price: 'DESC' };
            break;
          case 'name-asc':
            variables.sort = { name: 'ASC' };
            break;
          case 'name-desc':
            variables.sort = { name: 'DESC' };
            break;
          default:
            break;
        }
      }

      const data = await client.graphql<{ products: any }>(QUERIES.GET_PRODUCTS, variables);
      const result = mapPaginatedProducts(data.products);

      // Best-effort post-filtering by category/brand slug if requested.
      if (params?.categorySlug) {
        const filtered = result.items.filter((p) =>
          p.categories.some((c) => c.slug === params.categorySlug)
        );
        return {
          ...result,
          items: filtered,
          total: filtered.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      if (params?.brandSlug) {
        const filtered = result.items.filter((p) => p.brand.slug === params.brandSlug);
        return {
          ...result,
          items: filtered,
          total: filtered.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      return result;
    },

    async getBySlug(slug: string): Promise<Product | null> {
      const data = await client.graphql<{ products: { items: any[] } }>(
        QUERIES.GET_PRODUCT,
        { urlKey: slug }
      );

      if (!data.products.items.length) {
        return null;
      }

      return mapProduct(data.products.items[0]);
    },

    async getById(id: string): Promise<Product | null> {
      // Magento typically uses url_key, so we'll search by id
      const data = await client.graphql<{ products: { items: any[] } }>(
        `query GetProductById($id: String!) {
          products(filter: { id: { eq: $id } }) {
            items {
              id
              sku
              name
              url_key
              description { html }
              price_range {
                minimum_price {
                  regular_price { value currency }
                  final_price { value currency }
                  discount { amount_off percent_off }
                }
              }
              thumbnail { url label }
              rating_summary
              review_count
              stock_status
              categories { id name url_key }
            }
          }
        }`,
        { id }
      );

      if (!data.products.items.length) {
        return null;
      }

      return mapProduct(data.products.items[0]);
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

    async getRelated(productId: string, limit = 4): Promise<Product[]> {
      // Magento has related_products field, but we'll use category-based for simplicity
      const product = await this.getById(productId);
      if (!product || !product.categories.length) return [];

      const data = await client.graphql<{ products: { items: any[] } }>(
        QUERIES.GET_PRODUCTS,
        {
          pageSize: limit + 1,
          filter: { category_id: { eq: product.categories[0].id } },
        }
      );

      return data.products.items
        .filter((p: any) => p.id.toString() !== productId)
        .slice(0, limit)
        .map(mapProduct);
    },

    async getFeatured(limit = 8): Promise<Product[]> {
      // Magento doesn't have a built-in featured concept
      // You'd typically use a category or attribute for this
      const data = await client.graphql<{ products: { items: any[] } }>(
        QUERIES.GET_PRODUCTS,
        {
          pageSize: limit,
          sort: { position: 'ASC' },
        }
      );

      return data.products.items.map(mapProduct);
    },
  };
}

// ============================================================================
// Magento Categories API
// ============================================================================

function createCategoriesApi(client: MagentoGraphQLClient): CategoriesApi {
  return {
    async getAll(): Promise<Category[]> {
      const data = await client.graphql<{ categories: { items: any[] } }>(
        QUERIES.GET_CATEGORIES
      );

      return data.categories.items.map((item) => mapCategory(item));
    },

    async getTree(): Promise<Category[]> {
      return this.getAll();
    },

    async getBySlug(slug: string): Promise<Category | null> {
      const data = await client.graphql<{ categories: { items: any[] } }>(
        `query GetCategory($urlKey: String!) {
          categories(filters: { url_key: { eq: $urlKey } }) {
            items {
              id
              name
              url_key
              image
              description
              product_count
              level
            }
          }
        }`,
        { urlKey: slug }
      );

      if (!data.categories.items.length) {
        return null;
      }

      return mapCategory(data.categories.items[0]);
    },

    async getById(id: string): Promise<Category | null> {
      const all = await this.getAll();
      return all.find((c) => c.id === id) || null;
    },
  };
}

// ============================================================================
// Magento Brands API (Custom Implementation)
// ============================================================================

function createBrandsApi(client: MagentoGraphQLClient): BrandsApi {
  return {
    async getAll(): Promise<Brand[]> {
      // Magento doesn't have native brand support
      // This would typically come from a custom attribute or extension
      // For now, return empty or use custom query
      console.warn('Magento brands API requires custom implementation');
      return [];
    },

    async getBySlug(slug: string): Promise<Brand | null> {
      console.warn('Magento brands API requires custom implementation');
      return null;
    },

    async getById(id: string): Promise<Brand | null> {
      console.warn('Magento brands API requires custom implementation');
      return null;
    },
  };
}

// ============================================================================
// Magento Cart API
// ============================================================================

function createCartApi(client: MagentoGraphQLClient): CartApi {
  async function ensureCart(): Promise<string> {
    let cartId = client.getCartId();
    
    if (!cartId) {
      if (client.getToken()) {
        // Use customer cart
        const data = await client.graphql<{ customerCart: { id: string } }>(
          MUTATIONS.CREATE_CUSTOMER_CART
        );
        cartId = data.customerCart.id;
      } else {
        // Create guest cart
        const data = await client.graphql<{ createEmptyCart: string }>(
          MUTATIONS.CREATE_EMPTY_CART
        );
        cartId = data.createEmptyCart;
      }
      client.setCartId(cartId);
    }

    return cartId;
  }

  return {
    async get(): Promise<Cart> {
      const cartId = await ensureCart();
      const data = await client.graphql<{ cart: any }>(QUERIES.GET_CART, { cartId });
      return mapCart(data.cart);
    },

    async addItem(input: AddToCartInput): Promise<Cart> {
      const cartId = await ensureCart();
      await client.graphql(MUTATIONS.ADD_TO_CART, {
        cartId,
        sku: input.productId, // Assuming productId is SKU
        quantity: input.quantity,
      });
      return this.get();
    },

    async updateItem(input: UpdateCartItemInput): Promise<Cart> {
      const cartId = await ensureCart();
      await client.graphql(MUTATIONS.UPDATE_CART_ITEM, {
        cartId,
        itemId: parseInt(input.itemId),
        quantity: input.quantity,
      });
      return this.get();
    },

    async removeItem(itemId: string): Promise<Cart> {
      const cartId = await ensureCart();
      await client.graphql(MUTATIONS.REMOVE_FROM_CART, {
        cartId,
        itemId: parseInt(itemId),
      });
      return this.get();
    },

    async clear(): Promise<Cart> {
      // Magento doesn't have a clear cart mutation
      // Remove items one by one or create new cart
      client.setCartId(null);
      return this.get();
    },

    async applyCoupon(code: string): Promise<Cart> {
      const cartId = await ensureCart();
      await client.graphql(MUTATIONS.APPLY_COUPON, { cartId, couponCode: code });
      return this.get();
    },

    async removeCoupon(): Promise<Cart> {
      const cartId = await ensureCart();
      await client.graphql(MUTATIONS.REMOVE_COUPON, { cartId });
      return this.get();
    },

    async merge(guestCartId: string): Promise<Cart> {
      const customerCartId = await ensureCart();
      await client.graphql(MUTATIONS.MERGE_CARTS, {
        sourceCartId: guestCartId,
        destinationCartId: customerCartId,
      });
      return this.get();
    },
  };
}

// ============================================================================
// Magento Auth API
// ============================================================================

function createAuthApi(client: MagentoGraphQLClient, cartApi: CartApi): AuthApi {
  return {
    async login(input: LoginInput): Promise<AuthResponse> {
      const data = await client.graphql<{ generateCustomerToken: { token: string } }>(
        MUTATIONS.GENERATE_TOKEN,
        { email: input.email, password: input.password }
      );

      const token = data.generateCustomerToken.token;
      client.setToken(token);

      // Get user profile
      const userData = await client.graphql<{ customer: any }>(QUERIES.GET_CUSTOMER);
      const user = mapUser(userData.customer);

      // Merge guest cart if exists
      const guestCartId = client.getCartId();
      if (guestCartId) {
        try {
          await cartApi.merge(guestCartId);
        } catch (e) {
          console.warn('Failed to merge guest cart:', e);
        }
      }

      return {
        user,
        accessToken: token,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      };
    },

    async register(data: RegisterInput): Promise<AuthResponse> {
      await client.graphql(MUTATIONS.CREATE_CUSTOMER, {
        input: {
          email: data.email,
          password: data.password,
          firstname: data.firstName,
          lastname: data.lastName,
        },
      });

      // Login after registration
      return this.login({ email: data.email, password: data.password });
    },

    async logout(): Promise<void> {
      try {
        await client.graphql(MUTATIONS.REVOKE_TOKEN);
      } catch (e) {
        console.warn('Failed to revoke token:', e);
      }
      client.setToken(null);
      client.setCartId(null);
    },

    async getUser(): Promise<User | null> {
      if (!client.getToken()) return null;

      try {
        const data = await client.graphql<{ customer: any }>(QUERIES.GET_CUSTOMER);
        return mapUser(data.customer);
      } catch {
        client.setToken(null);
        return null;
      }
    },

    async updateUser(data: Partial<User>): Promise<User> {
      const input: Record<string, unknown> = {};
      if (data.firstName) input.firstname = data.firstName;
      if (data.lastName) input.lastname = data.lastName;

      await client.graphql(MUTATIONS.UPDATE_CUSTOMER, { input });

      const userData = await client.graphql<{ customer: any }>(QUERIES.GET_CUSTOMER);
      return mapUser(userData.customer);
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
      await client.graphql(MUTATIONS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
    },

    async requestPasswordReset(email: string): Promise<void> {
      await client.graphql(MUTATIONS.REQUEST_PASSWORD_RESET, { email });
    },

    async resetPassword(token: string, newPassword: string): Promise<void> {
      // Magento requires an email for this mutation; the unified interface does not provide it.
      // Implement this when the UI can provide email alongside the token.
      throw new Error('Password reset not supported without email (Magento)');
    },

    async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
      const input = {
        firstname: address.firstName,
        lastname: address.lastName,
        company: address.company,
        street: address.street,
        city: address.city,
        region: { region_code: address.regionCode || address.region },
        postcode: address.postcode,
        country_code: address.countryCode || address.country,
        telephone: address.phone,
        default_shipping: address.isDefaultShipping,
        default_billing: address.isDefaultBilling,
      };

      const data = await client.graphql<{ createCustomerAddress: any }>(
        MUTATIONS.CREATE_ADDRESS,
        { input }
      );

      return {
        id: data.createCustomerAddress.id.toString(),
        ...address,
      };
    },

    async updateAddress(addressId: string, data: Partial<Address>): Promise<Address> {
      const input: Record<string, unknown> = {};
      if (data.firstName) input.firstname = data.firstName;
      if (data.lastName) input.lastname = data.lastName;
      if (data.company) input.company = data.company;
      if (data.street) input.street = data.street;
      if (data.city) input.city = data.city;
      if (data.region) input.region = { region_code: data.region };
      if (data.postcode) input.postcode = data.postcode;
      if (data.country) input.country_code = data.country;
      if (data.phone) input.telephone = data.phone;

      await client.graphql(MUTATIONS.UPDATE_ADDRESS, {
        id: parseInt(addressId),
        input,
      });

      // Return updated address (fetch fresh data)
      const userData = await client.graphql<{ customer: any }>(QUERIES.GET_CUSTOMER);
      const user = mapUser(userData.customer);
      return user.addresses?.find((a) => a.id === addressId) || { id: addressId, ...data } as Address;
    },

    async deleteAddress(addressId: string): Promise<void> {
      await client.graphql(MUTATIONS.DELETE_ADDRESS, { id: parseInt(addressId) });
    },

    async refreshToken(): Promise<AuthResponse> {
      const token = client.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const userData = await client.graphql<{ customer: any }>(QUERIES.GET_CUSTOMER);
      const user = mapUser(userData.customer);

      return {
        user,
        accessToken: token,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      };
    },
  };
}

// ============================================================================
// Magento Checkout API
// ============================================================================

function createCheckoutApi(client: MagentoGraphQLClient, cartApi: CartApi): CheckoutApi {
  return {
    async getSession(): Promise<CheckoutSession> {
      const cart = await cartApi.get();

      return {
        id: cart.id,
        cart,
        step: 'shipping',
        availableShippingMethods: [], // Would be populated from Magento
        availablePaymentMethods: [], // Would be populated from Magento
      };
    },

    async setEmail(email: string): Promise<CheckoutSession> {
      const session = await this.getSession();
      return { ...session, email };
    },

    async setShippingAddress(input: SetShippingAddressInput): Promise<CheckoutSession> {
      const session = await this.getSession();
      const address = input.address;

      await client.graphql(MUTATIONS.SET_SHIPPING_ADDRESS, {
        cartId: session.id,
        address: {
          firstname: address.firstName,
          lastname: address.lastName,
          company: address.company,
          street: address.street,
          city: address.city,
          region: address.region,
          postcode: address.postcode,
          country_code: address.countryCode,
          telephone: address.phone,
        },
      });

      return this.getSession();
    },

    async setBillingAddress(input: SetBillingAddressInput): Promise<CheckoutSession> {
      const session = await this.getSession();
      const address = input.address;

      await client.graphql(MUTATIONS.SET_BILLING_ADDRESS, {
        cartId: session.id,
        address: {
          firstname: address.firstName,
          lastname: address.lastName,
          company: address.company,
          street: address.street,
          city: address.city,
          region: address.region,
          postcode: address.postcode,
          country_code: address.countryCode,
          telephone: address.phone,
        },
      });

      return this.getSession();
    },

    async setShippingMethod(methodCode: string): Promise<CheckoutSession> {
      const session = await this.getSession();
      // methodCode format: "carrier_code|method_code"
      const [carrierCode, actualMethodCode] = methodCode.split('|');

      await client.graphql(MUTATIONS.SET_SHIPPING_METHOD, {
        cartId: session.id,
        carrierCode,
        methodCode: actualMethodCode,
      });

      return this.getSession();
    },

    async getShippingMethods(): Promise<ShippingMethod[]> {
      return [];
    },

    async getPaymentMethods(): Promise<PaymentMethod[]> {
      return [];
    },

    async placeOrder(_input: PlaceOrderInput): Promise<PlaceOrderResult> {
      const session = await this.getSession();
      const data = await client.graphql<{ placeOrder: { order: { order_number: string } } }>(
        MUTATIONS.PLACE_ORDER,
        { cartId: session.id }
      );

      // Clear cart after placing order
      client.setCartId(null);

      // Fetch order details
      const orderNumber = data.placeOrder.order.order_number;
      const ordersApi = createOrdersApi(client);
      const order = await ordersApi.getByOrderNumber(orderNumber);

      if (!order) {
        throw new Error('Order placed but could not fetch details');
      }

      return { order };
    },
  };
}

// ============================================================================
// Magento Orders API
// ============================================================================

function createOrdersApi(client: MagentoGraphQLClient): OrdersApi {
  return {
    async getAll(page = 1, pageSize = 10): Promise<PaginatedResult<Order>> {
      const data = await client.graphql<{ customer: { orders: any } }>(
        QUERIES.GET_CUSTOMER_ORDERS,
        {
          pageSize,
          currentPage: page,
        }
      );

      const orders = data.customer.orders;

      return {
        items: orders.items.map(mapOrder),
        total: orders.total_count,
        page: orders.page_info.current_page,
        totalPages: orders.page_info.total_pages,
        pageSize: orders.page_info.page_size,
        hasNextPage: orders.page_info.current_page < orders.page_info.total_pages,
        hasPreviousPage: orders.page_info.current_page > 1,
      };
    },

    async getById(orderId: string): Promise<Order | null> {
      const result = await this.getAll(1, 100);
      return result.items.find((o: Order) => o.id === orderId) || null;
    },

    async getByOrderNumber(orderNumber: string): Promise<Order | null> {
      const result = await this.getAll(1, 100);
      return result.items.find((o: Order) => o.orderNumber === orderNumber) || null;
    },

    async cancel(_orderId: string): Promise<Order> {
      throw new Error('Order cancellation not supported via Magento GraphQL');
    },

    async requestReturn(
      _orderId: string,
      _items: { itemId: string; quantity: number; reason: string }[]
    ): Promise<void> {
      throw new Error('Returns not supported via Magento GraphQL');
    },
  };
}

// ============================================================================
// Magento Provider Factory
// ============================================================================

export function createMagentoProvider(config?: ProviderConfig): ApiProvider {
  const clientProxyPath = process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_PROXY_PATH || '/api/magento/graphql';
  const upstreamGraphqlUrl =
    config?.baseUrl
      ? `${config.baseUrl}/graphql`
      : process.env.MAGENTO_UPSTREAM_GRAPHQL_URL || process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL || '';

  const graphqlUrl =
    typeof window === 'undefined' ? upstreamGraphqlUrl : clientProxyPath || upstreamGraphqlUrl;

  const magentoConfig: MagentoConfig = {
    apiUrl: config?.baseUrl || process.env.NEXT_PUBLIC_MAGENTO_API_URL || '',
    graphqlUrl,
    storeCode: config?.storeCode,
  };

  if (!magentoConfig.graphqlUrl) {
    throw new Error('Magento GraphQL URL is required');
  }

  const client = new MagentoGraphQLClient(magentoConfig);
  const cartApi = createCartApi(client);

  console.log('Magento API Provider initialized', { baseUrl: magentoConfig.graphqlUrl });

  return {
    name: 'magento',
    products: createProductsApi(client),
    categories: createCategoriesApi(client),
    brands: createBrandsApi(client),
    cart: cartApi,
    auth: createAuthApi(client, cartApi),
    checkout: createCheckoutApi(client, cartApi),
    orders: createOrdersApi(client),
  };
}

export default createMagentoProvider;
