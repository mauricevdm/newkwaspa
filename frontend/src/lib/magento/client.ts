import { Product } from '@/components/product';

const MAGENTO_API_URL = process.env.NEXT_PUBLIC_MAGENTO_API_URL || '';
const MAGENTO_GRAPHQL_URL = process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL || '';

interface MagentoConfig {
  apiUrl: string;
  graphqlUrl: string;
  storeCode?: string;
}

class MagentoClient {
  private config: MagentoConfig;
  private token: string | null = null;

  constructor(config: MagentoConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Magento API error: ${response.statusText}`);
    }

    return response.json();
  }

  async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.config.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // Products
  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    searchTerm?: string;
    sortField?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<{ items: Product[]; total: number }> {
    const query = `
      query GetProducts(
        $pageSize: Int
        $currentPage: Int
        $filter: ProductAttributeFilterInput
        $sort: ProductAttributeSortInput
      ) {
        products(
          pageSize: $pageSize
          currentPage: $currentPage
          filter: $filter
          sort: $sort
        ) {
          total_count
          items {
            id
            sku
            name
            url_key
            price_range {
              minimum_price {
                regular_price { value currency }
                final_price { value currency }
                discount { amount_off percent_off }
              }
            }
            image { url label }
            small_image { url label }
            thumbnail { url label }
            rating_summary
            review_count
            stock_status
            ... on ConfigurableProduct {
              variants {
                product { sku }
                attributes { code label value_index }
              }
            }
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
    `;

    const variables: Record<string, unknown> = {
      pageSize: params?.pageSize || 24,
      currentPage: params?.page || 1,
    };

    if (params?.categoryId) {
      variables.filter = { category_id: { eq: params.categoryId } };
    }

    if (params?.searchTerm) {
      variables.filter = { ...variables.filter as object, name: { match: params.searchTerm } };
    }

    if (params?.sortField) {
      variables.sort = { [params.sortField]: params.sortDirection || 'ASC' };
    }

    const data = await this.graphql<{ products: { total_count: number; items: unknown[] } }>(
      query,
      variables
    );

    return {
      items: data.products.items.map(this.mapProduct),
      total: data.products.total_count,
    };
  }

  async getProduct(slug: string): Promise<Product | null> {
    const query = `
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
            media_gallery {
              url
              label
              position
            }
            rating_summary
            review_count
            stock_status
            meta_title
            meta_description
            categories { id name url_key }
            ... on ConfigurableProduct {
              configurable_options {
                attribute_code
                label
                values { value_index label }
              }
              variants {
                product { sku }
                attributes { code label value_index }
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{ products: { items: unknown[] } }>(query, {
      urlKey: slug,
    });

    if (!data.products.items.length) {
      return null;
    }

    return this.mapProduct(data.products.items[0]);
  }

  async getCategories(): Promise<unknown[]> {
    const query = `
      query GetCategories {
        categories {
          items {
            id
            name
            url_key
            children {
              id
              name
              url_key
              children {
                id
                name
                url_key
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{ categories: { items: unknown[] } }>(query);
    return data.categories.items;
  }

  // Cart
  async createCart(): Promise<string> {
    const query = `
      mutation {
        createEmptyCart
      }
    `;

    const data = await this.graphql<{ createEmptyCart: string }>(query);
    return data.createEmptyCart;
  }

  async addToCart(cartId: string, sku: string, quantity: number): Promise<unknown> {
    const query = `
      mutation AddToCart($cartId: String!, $sku: String!, $quantity: Float!) {
        addSimpleProductsToCart(
          input: {
            cart_id: $cartId
            cart_items: [{ data: { sku: $sku, quantity: $quantity } }]
          }
        ) {
          cart {
            items {
              id
              product { sku name }
              quantity
              prices {
                row_total { value currency }
              }
            }
          }
        }
      }
    `;

    return this.graphql(query, { cartId, sku, quantity });
  }

  async getCart(cartId: string): Promise<unknown> {
    const query = `
      query GetCart($cartId: String!) {
        cart(cart_id: $cartId) {
          id
          items {
            id
            product {
              sku
              name
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
            grand_total { value currency }
            discounts { amount { value } label }
          }
          shipping_addresses {
            selected_shipping_method {
              carrier_title
              method_title
              amount { value currency }
            }
          }
        }
      }
    `;

    return this.graphql(query, { cartId });
  }

  // Customer
  async login(email: string, password: string): Promise<{ token: string }> {
    const query = `
      mutation GenerateToken($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
          token
        }
      }
    `;

    const data = await this.graphql<{ generateCustomerToken: { token: string } }>(query, {
      email,
      password,
    });

    this.setToken(data.generateCustomerToken.token);
    return { token: data.generateCustomerToken.token };
  }

  async register(input: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }): Promise<unknown> {
    const query = `
      mutation CreateCustomer($input: CustomerCreateInput!) {
        createCustomerV2(input: $input) {
          customer {
            email
            firstname
            lastname
          }
        }
      }
    `;

    return this.graphql(query, { input });
  }

  async getCustomer(): Promise<unknown> {
    const query = `
      query {
        customer {
          email
          firstname
          lastname
          addresses {
            id
            firstname
            lastname
            street
            city
            region { region_code }
            postcode
            country_code
            telephone
            default_billing
            default_shipping
          }
        }
      }
    `;

    return this.graphql(query);
  }

  // Helper to map Magento product to our Product type
  private mapProduct(item: any): Product {
    const priceRange = item.price_range?.minimum_price;
    
    return {
      id: item.id?.toString() || item.sku,
      name: item.name,
      slug: item.url_key,
      brand: 'Brand', // Would need to be extracted from custom attribute
      price: priceRange?.final_price?.value || 0,
      originalPrice: priceRange?.regular_price?.value,
      image: item.thumbnail?.url || item.image?.url || '',
      rating: (item.rating_summary || 0) / 20, // Convert 0-100 to 0-5
      reviewCount: item.review_count || 0,
      inStock: item.stock_status === 'IN_STOCK',
    };
  }
}

// Create singleton instance
export const magentoClient = new MagentoClient({
  apiUrl: MAGENTO_API_URL,
  graphqlUrl: MAGENTO_GRAPHQL_URL,
});

export default magentoClient;
