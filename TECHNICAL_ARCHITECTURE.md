# Dermastore Technical Architecture

## React + Magento 2 API + AI/ML Platform

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Integration](#backend-integration)
6. [AI/ML Services](#aiml-services)
7. [API Architecture](#api-architecture)
8. [State Management](#state-management)
9. [Authentication & Authorization](#authentication--authorization)
10. [Performance Optimization](#performance-optimization)
11. [Security](#security)
12. [Deployment](#deployment)
13. [Monitoring & Analytics](#monitoring--analytics)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Mobile Web  │  │   PWA App    │          │
│  │   (React)    │  │   (React)    │  │   (React)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│                    (Next.js API Routes / Node.js)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
      ┌──────────────┐ ┌──────────┐ ┌─────────────┐
      │  Magento 2   │ │ AI/ML    │ │  Custom     │
      │  REST/GraphQL│ │ Services │ │  Services   │
      └──────────────┘ └──────────┘ └─────────────┘
                 │            │            │
                 ▼            ▼            ▼
      ┌──────────────┐ ┌──────────┐ ┌─────────────┐
      │   MySQL /    │ │  Cloud   │ │  PostgreSQL │
      │ Elasticsearch│ │  ML APIs │ │  Database   │
      └──────────────┘ └──────────┘ └─────────────┘
```

### Key Objectives

1. **Replicate Existing Site**: Maintain feature parity with current Dermastore
2. **Enhance with AI/ML**: Add intelligent features for personalization
3. **Modern Stack**: Use React for better performance and UX
4. **Headless Commerce**: Magento 2 REST/GraphQL API for flexible frontend
5. **Scalability**: Cloud-native architecture for growth
6. **SEO Optimization**: Server-side rendering with Next.js

---

## Technology Stack

### Frontend

#### Core Framework
```json
{
  "framework": "Next.js 14",
  "version": "14.0.0",
  "rendering": "SSR + SSG + ISR",
  "features": ["App Router", "Server Components", "Streaming"]
}
```

#### UI Libraries
```json
{
  "ui": "React 18",
  "styling": "Tailwind CSS + CSS Modules",
  "components": "Radix UI + Headless UI",
  "animations": "Framer Motion",
  "forms": "React Hook Form + Zod",
  "tables": "TanStack Table"
}
```

#### State Management
```json
{
  "global": "Zustand",
  "server": "TanStack Query (React Query)",
  "forms": "React Hook Form",
  "url": "Next.js Router"
}
```

#### Data Fetching
```json
{
  "library": "TanStack Query",
  "features": ["Caching", "Prefetching", "Optimistic Updates"],
  "api": "Axios"
}
```

### Backend

#### API Layer
```json
{
  "platform": "Next.js API Routes",
  "alternative": "Express.js (if needed)",
  "graphql": "Apollo Server (optional)",
  "rest": "Native Fetch + Axios"
}
```

#### E-commerce Backend
```json
{
  "platform": "Adobe Commerce (Magento 2)",
  "version": "Magento 2.4.x",
  "api": "Magento REST API + GraphQL",
  "auth": "OAuth 2.0 / Bearer Token / Integration Tokens",
  "search": "Elasticsearch 8.x / OpenSearch",
  "cache": "Varnish + Redis"
}
```

#### Custom Services
```json
{
  "database": "PostgreSQL 15",
  "orm": "Prisma",
  "cache": "Redis",
  "storage": "AWS S3 / Cloudflare R2"
}
```

### AI/ML Services

#### Computer Vision
```json
{
  "provider": "Azure Computer Vision / AWS Rekognition",
  "features": ["Face Detection", "Skin Analysis", "Object Detection"],
  "custom": "TensorFlow.js (client-side)"
}
```

#### Recommendation Engine
```json
{
  "algorithm": "Collaborative Filtering + Content-Based",
  "library": "TensorFlow / scikit-learn",
  "hosting": "AWS SageMaker / Azure ML"
}
```

#### Natural Language Processing
```json
{
  "provider": "OpenAI GPT-4 / Azure OpenAI",
  "features": ["Chatbot", "Search", "Content Generation"],
  "library": "LangChain"
}
```

#### Image Analysis
```json
{
  "provider": "Custom ML Model",
  "framework": "PyTorch / TensorFlow",
  "features": ["Skin Condition Detection", "Product Recognition"]
}
```

### DevOps & Infrastructure

#### Hosting
```json
{
  "frontend": "Vercel / Netlify",
  "backend": "AWS / Azure / Google Cloud",
  "cdn": "Cloudflare",
  "database": "AWS RDS / Azure Database"
}
```

#### CI/CD
```json
{
  "pipeline": "GitHub Actions",
  "testing": "Jest + React Testing Library + Playwright",
  "linting": "ESLint + Prettier",
  "type-checking": "TypeScript"
}
```

---

## Architecture Patterns

### 1. Micro-Frontend Architecture (Optional)

For large-scale applications, consider splitting into micro-frontends:

```
┌─────────────────────────────────────────────┐
│           Main Application Shell            │
│              (Next.js Host)                 │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Shop    │  │  Account │  │  AI      │ │
│  │  Module  │  │  Module  │  │  Module  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────┘
```

Benefits:
- Independent deployment
- Team autonomy
- Technology diversity (if needed)
- Better scalability

### 2. Serverless Architecture

Use serverless functions for specific features:

```javascript
// API Routes as Serverless Functions
pages/api/
├── products/
│   ├── [id].js        // GET /api/products/:id
│   └── search.js      // GET /api/products/search
├── cart/
│   ├── add.js         // POST /api/cart/add
│   └── update.js      // PUT /api/cart/update
├── ai/
│   ├── analyze.js     // POST /api/ai/analyze
│   ├── recommend.js   // GET /api/ai/recommend
│   └── chatbot.js     // POST /api/ai/chatbot
└── webhooks/
    └── woocommerce.js // POST /api/webhooks/woocommerce
```

### 3. Event-Driven Architecture

For real-time features and background processing:

```
User Action → Frontend → API Gateway → Event Queue
                                           │
                         ┌─────────────────┼─────────────────┐
                         ▼                 ▼                 ▼
                   Order Service    Email Service    Analytics Service
```

Tools:
- **Queue**: Redis Bull / AWS SQS
- **Pub/Sub**: Redis / AWS SNS
- **WebSockets**: Socket.io / Pusher

---

## Frontend Architecture

### Project Structure

```
dermastore-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/            # Shop group routes
│   │   │   ├── page.tsx       # Shop homepage
│   │   │   ├── [category]/    # Category pages
│   │   │   └── product/
│   │   │       └── [slug]/    # Product detail pages
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   ├── api/               # API Routes
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   └── ai/
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   │
│   ├── components/            # React Components
│   │   ├── ui/               # Base UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── ...
│   │   ├── layout/           # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   ├── shop/             # Shop-specific components
│   │   │   ├── ProductCard/
│   │   │   ├── ProductGrid/
│   │   │   ├── FilterSidebar/
│   │   │   └── ...
│   │   ├── cart/             # Cart components
│   │   │   ├── CartItem/
│   │   │   ├── CartSummary/
│   │   │   └── ...
│   │   └── ai/               # AI feature components
│   │       ├── SkinAnalysis/
│   │       ├── Chatbot/
│   │       └── Recommendations/
│   │
│   ├── lib/                  # Utilities & Helpers
│   │   ├── api/             # API clients
│   │   │   ├── woocommerce.ts
│   │   │   ├── ai-service.ts
│   │   │   └── custom-api.ts
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useCart.ts
│   │   │   ├── useProducts.ts
│   │   │   └── useAuth.ts
│   │   ├── utils/           # Helper functions
│   │   │   ├── formatting.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   └── types/           # TypeScript types
│   │       ├── product.ts
│   │       ├── cart.ts
│   │       └── user.ts
│   │
│   ├── store/               # State Management
│   │   ├── cart.ts          # Cart store (Zustand)
│   │   ├── user.ts          # User store
│   │   └── ui.ts            # UI state store
│   │
│   ├── styles/              # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   └── config/              # Configuration
│       ├── site.ts          # Site config
│       ├── api.ts           # API endpoints
│       └── features.ts      # Feature flags
│
├── public/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                   # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local              # Environment variables
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

### Key Architectural Decisions

#### 1. Next.js App Router

**Why**: Server Components, improved routing, better performance

```typescript
// app/product/[slug]/page.tsx
import { getProduct } from '@/lib/api/woocommerce';
import ProductDetail from '@/components/shop/ProductDetail';

// Server Component - Fetches data on server
export default async function ProductPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const product = await getProduct(params.slug);
  
  return <ProductDetail product={product} />;
}

// Generate static pages at build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}
```

#### 2. TypeScript Throughout

**Why**: Type safety, better DX, fewer runtime errors

```typescript
// lib/types/product.ts
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  images: ProductImage[];
  categories: Category[];
  attributes: ProductAttribute[];
  variations?: ProductVariation[];
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  rating: number;
  reviewCount: number;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  position: number;
}
```

#### 3. Component Architecture

**Atomic Design Pattern**:

```
Atoms → Molecules → Organisms → Templates → Pages
```

Example:
```typescript
// Atom: Button
export function Button({ children, variant, ...props }: ButtonProps) {
  return <button className={cn(variants[variant])} {...props}>{children}</button>;
}

// Molecule: ProductCard
export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image src={product.image} />
      <h3>{product.name}</h3>
      <Price value={product.price} />
      <Button>Add to Cart</Button>
    </div>
  );
}

// Organism: ProductGrid
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

// Template: ShopTemplate
export function ShopTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <FilterSidebar />
      <main>{children}</main>
    </div>
  );
}
```

#### 4. Custom Hooks for Logic Reuse

```typescript
// hooks/useCart.ts
export function useCart() {
  const addToCart = useCartStore((state) => state.addItem);
  const removeFromCart = useCartStore((state) => state.removeItem);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);

  const { mutate: syncCart } = useMutation({
    mutationFn: (items: CartItem[]) => syncCartWithBackend(items),
  });

  useEffect(() => {
    // Sync cart with backend on change
    syncCart(items);
  }, [items]);

  return {
    items,
    total,
    addToCart,
    removeFromCart,
    itemCount: items.length,
  };
}

// Usage in component
function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Button onClick={() => addToCart(product)}>
      Add to Cart
    </Button>
  );
}
```

---

## Backend Integration

### Magento 2 API Integration

Magento 2 offers both **REST API** and **GraphQL API**. We'll use GraphQL for complex queries (products, categories) and REST for mutations (orders, cart).

#### Authentication

```typescript
// lib/api/magento.ts
import axios from 'axios';

// Magento API Client with Bearer Token Authentication
const magentoApi = axios.create({
  baseURL: process.env.MAGENTO_API_URL, // e.g., https://store.dermastore.co.za/rest/V1
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Bearer token to all requests
magentoApi.interceptors.request.use((config) => {
  const token = process.env.MAGENTO_ACCESS_TOKEN; // Integration token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GraphQL Client for complex queries
import { GraphQLClient } from 'graphql-request';

export const magentoGraphQL = new GraphQLClient(
  process.env.MAGENTO_GRAPHQL_URL!, // e.g., https://store.dermastore.co.za/graphql
  {
    headers: {
      'Content-Type': 'application/json',
      Store: 'default', // Store view code
    },
  }
);

// Customer token authentication (for logged-in users)
export async function getCustomerToken(email: string, password: string): Promise<string> {
  const response = await magentoApi.post('/integration/customer/token', {
    username: email,
    password: password,
  });
  return response.data; // Returns JWT token
}
```

#### GraphQL Product Queries

```typescript
// lib/api/magento-products.ts
import { gql } from 'graphql-request';
import { magentoGraphQL } from './magento';

const PRODUCTS_QUERY = gql`
  query GetProducts($search: String, $filter: ProductAttributeFilterInput, $pageSize: Int, $currentPage: Int, $sort: ProductAttributeSortInput) {
    products(
      search: $search
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
    ) {
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
      items {
        id
        uid
        sku
        name
        url_key
        stock_status
        rating_summary
        review_count
        price_range {
          minimum_price {
            regular_price { value currency }
            final_price { value currency }
            discount { amount_off percent_off }
          }
        }
        image {
          url
          label
        }
        small_image {
          url
          label
        }
        categories {
          id
          name
          url_path
        }
        ... on ConfigurableProduct {
          configurable_options {
            attribute_code
            label
            values {
              value_index
              label
              swatch_data {
                value
              }
            }
          }
          variants {
            product {
              sku
              stock_status
              price_range {
                minimum_price {
                  final_price { value currency }
                }
              }
            }
            attributes {
              code
              value_index
            }
          }
        }
      }
    }
  }
`;

export async function getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
  const variables = {
    search: params?.search || '',
    filter: params?.filter || {},
    pageSize: params?.pageSize || 24,
    currentPage: params?.currentPage || 1,
    sort: params?.sort || { position: 'ASC' },
  };

  const data = await magentoGraphQL.request(PRODUCTS_QUERY, variables);
  return data.products;
}

const PRODUCT_DETAIL_QUERY = gql`
  query GetProductDetail($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        id
        uid
        sku
        name
        url_key
        meta_title
        meta_description
        description { html }
        short_description { html }
        stock_status
        rating_summary
        review_count
        price_range {
          minimum_price {
            regular_price { value currency }
            final_price { value currency }
            discount { amount_off percent_off }
          }
          maximum_price {
            regular_price { value currency }
            final_price { value currency }
          }
        }
        media_gallery {
          url
          label
          position
          ... on ProductVideo {
            video_content {
              video_url
              video_title
            }
          }
        }
        categories {
          id
          name
          url_path
          breadcrumbs {
            category_id
            category_name
            category_url_path
          }
        }
        related_products {
          id
          sku
          name
          url_key
          price_range {
            minimum_price {
              final_price { value currency }
            }
          }
          image { url label }
        }
        upsell_products {
          id
          sku
          name
          url_key
          image { url label }
        }
        reviews {
          items {
            nickname
            summary
            text
            average_rating
            created_at
            ratings_breakdown {
              name
              value
            }
          }
          page_info {
            total_pages
          }
        }
      }
    }
  }
`;

export async function getProduct(urlKey: string): Promise<Product> {
  const data = await magentoGraphQL.request(PRODUCT_DETAIL_QUERY, { urlKey });
  return data.products.items[0];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const result = await getProducts({ search: query, pageSize: 20 });
  return result.items;
}
```

#### REST API Functions (Cart, Orders, Customers)

```typescript
// lib/api/magento-rest.ts
import { magentoApi } from './magento';

// ============ CART OPERATIONS ============

// Create guest cart
export async function createGuestCart(): Promise<string> {
  const response = await magentoApi.post('/guest-carts');
  return response.data; // Returns cart ID (masked quote ID)
}

// Create customer cart
export async function createCustomerCart(customerToken: string): Promise<string> {
  const response = await magentoApi.post('/carts/mine', {}, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  return response.data; // Returns cart ID
}

// Add item to cart
export async function addToCart(
  cartId: string,
  item: { sku: string; qty: number; quote_id?: string },
  isGuest: boolean = true
): Promise<CartItem> {
  const endpoint = isGuest
    ? `/guest-carts/${cartId}/items`
    : '/carts/mine/items';

  const response = await magentoApi.post(endpoint, {
    cartItem: {
      sku: item.sku,
      qty: item.qty,
      quote_id: cartId,
    },
  });
  return response.data;
}

// Get cart totals
export async function getCartTotals(cartId: string, isGuest: boolean = true): Promise<CartTotals> {
  const endpoint = isGuest
    ? `/guest-carts/${cartId}/totals`
    : '/carts/mine/totals';

  const response = await magentoApi.get(endpoint);
  return response.data;
}

// ============ ORDER OPERATIONS ============

// Place order (guest)
export async function placeGuestOrder(
  cartId: string,
  paymentMethod: PaymentMethodInput,
  billingAddress: AddressInput
): Promise<string> {
  const response = await magentoApi.post(`/guest-carts/${cartId}/payment-information`, {
    email: billingAddress.email,
    paymentMethod: paymentMethod,
    billingAddress: billingAddress,
  });
  return response.data; // Returns order ID
}

// Get order details
export async function getOrder(orderId: string): Promise<Order> {
  const response = await magentoApi.get(`/orders/${orderId}`);
  return response.data;
}

// ============ CUSTOMER OPERATIONS ============

// Create customer account
export async function createCustomer(customerData: CreateCustomerInput): Promise<Customer> {
  const response = await magentoApi.post('/customers', {
    customer: customerData,
    password: customerData.password,
  });
  return response.data;
}

// Get customer info
export async function getCustomer(customerToken: string): Promise<Customer> {
  const response = await magentoApi.get('/customers/me', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  return response.data;
}

// Get customer orders
export async function getCustomerOrders(customerToken: string): Promise<Order[]> {
  const response = await magentoApi.get('/orders', {
    headers: { Authorization: `Bearer ${customerToken}` },
    params: {
      'searchCriteria[filter_groups][0][filters][0][field]': 'customer_id',
      'searchCriteria[filter_groups][0][filters][0][condition_type]': 'eq',
      'searchCriteria[sortOrders][0][field]': 'created_at',
      'searchCriteria[sortOrders][0][direction]': 'DESC',
    },
  });
  return response.data.items;
}
```

#### Error Handling

```typescript
// lib/api/error-handler.ts
import { AxiosError } from 'axios';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'An error occurred';
    const code = error.response?.data?.code || 'unknown_error';
    
    throw new APIError(message, status, code);
  }
  
  throw new APIError('Unknown error occurred', 500, 'unknown_error');
}

// Usage
try {
  const products = await getProducts();
} catch (error) {
  handleAPIError(error);
}
```

### Caching Strategy

```typescript
// lib/api/cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const data = await fetcher();
  
  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}

// Usage with Magento
export async function getProductsCached(params?: ProductQueryParams) {
  const cacheKey = `magento:products:${JSON.stringify(params)}`;
  return getCached(cacheKey, () => getProducts(params), 600); // 10 min cache
}
```

### Webhooks Handling (Magento)

Magento uses **Message Queues** (RabbitMQ/MySQL) for async processing and webhooks for external integrations.

```typescript
// app/api/webhooks/magento/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-magento-signature');
  const body = await request.text();

  // Verify webhook signature (custom implementation)
  const expectedSignature = crypto
    .createHmac('sha256', process.env.MAGENTO_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Handle different Magento events
  switch (event.event_type) {
    case 'sales_order_save_after':
      await handleOrderCreated(event.data);
      break;
    case 'sales_order_shipment_save_after':
      await handleOrderShipped(event.data);
      break;
    case 'catalog_product_save_after':
      await invalidateProductCache(event.data.sku);
      break;
    case 'customer_save_after':
      await handleCustomerUpdated(event.data);
      break;
    case 'inventory_source_item_save_after':
      await handleStockUpdate(event.data);
      break;
    default:
      console.log(`Unhandled Magento event: ${event.event_type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleOrderCreated(order: MagentoOrder) {
  // Send confirmation email
  await sendOrderConfirmationEmail(order);
  
  // Update analytics
  await trackOrderEvent(order);
  
  // Trigger fulfillment workflow
  await initiateFulfillment(order);
  
  // Update AI recommendation engine
  await updateRecommendationData(order.customer_id, order.items);
}

async function handleStockUpdate(stockData: StockUpdate) {
  // Invalidate product cache
  await redis.del(`magento:product:${stockData.sku}`);
  
  // Notify customers if back in stock
  if (stockData.quantity > 0) {
    await notifyBackInStock(stockData.sku);
  }
}
```

---

## AI/ML Services

### 1. Skin Analysis Service

#### Architecture

```
User Photo → Frontend → API Gateway → Image Processing
                                           │
                                           ▼
                               Azure Computer Vision API
                                           │
                                           ▼
                                  Custom ML Model (Skin Analysis)
                                           │
                                           ▼
                                  Analysis Results + Recommendations
```

#### Implementation

```typescript
// app/api/ai/analyze-skin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkin } from '@/lib/ai/skin-analysis';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert to buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Analyze skin
    const analysis = await analyzeSkin(buffer);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Skin analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
```

```typescript
// lib/ai/skin-analysis.ts
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';
import axios from 'axios';

const cvClient = new ComputerVisionClient(
  new CognitiveServicesCredentials(process.env.AZURE_CV_KEY!),
  process.env.AZURE_CV_ENDPOINT!
);

export interface SkinAnalysis {
  score: number;
  concerns: SkinConcern[];
  skinType: string;
  recommendations: string[];
  products: number[]; // Product IDs
}

export interface SkinConcern {
  type: 'wrinkles' | 'dark_spots' | 'acne' | 'redness' | 'dryness';
  severity: number; // 0-100
  confidence: number; // 0-1
  location: { x: number; y: number; width: number; height: number };
}

export async function analyzeSkin(imageBuffer: Buffer): Promise<SkinAnalysis> {
  // Step 1: Face detection using Azure CV
  const faceAnalysis = await cvClient.analyzeImageInStream(imageBuffer, {
    visualFeatures: ['Faces', 'Color', 'ImageType'],
  });

  if (!faceAnalysis.faces || faceAnalysis.faces.length === 0) {
    throw new Error('No face detected in image');
  }

  // Step 2: Send to custom ML model for detailed skin analysis
  const response = await axios.post(
    process.env.CUSTOM_ML_ENDPOINT!,
    {
      image: imageBuffer.toString('base64'),
      face_box: faceAnalysis.faces[0].faceRectangle,
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.ML_API_KEY}`,
      },
    }
  );

  const mlResults = response.data;

  // Step 3: Generate recommendations based on detected concerns
  const concerns: SkinConcern[] = mlResults.concerns;
  const recommendations = generateRecommendations(concerns);
  const productIds = await getRecommendedProducts(concerns);

  return {
    score: calculateSkinScore(concerns),
    concerns,
    skinType: mlResults.skin_type,
    recommendations,
    products: productIds,
  };
}

function calculateSkinScore(concerns: SkinConcern[]): number {
  const totalSeverity = concerns.reduce((sum, c) => sum + c.severity, 0);
  const avgSeverity = totalSeverity / concerns.length;
  return Math.max(0, 100 - avgSeverity);
}

function generateRecommendations(concerns: SkinConcern[]): string[] {
  const recommendations: string[] = [];

  concerns.forEach((concern) => {
    switch (concern.type) {
      case 'wrinkles':
        recommendations.push('Use retinol-based products');
        recommendations.push('Apply sunscreen daily');
        break;
      case 'dark_spots':
        recommendations.push('Use vitamin C serum');
        recommendations.push('Consider niacinamide products');
        break;
      case 'acne':
        recommendations.push('Use salicylic acid cleanser');
        recommendations.push('Apply benzoyl peroxide treatment');
        break;
      // ... more cases
    }
  });

  return [...new Set(recommendations)]; // Remove duplicates
}

async function getRecommendedProducts(concerns: SkinConcern[]): Promise<number[]> {
  // Query products based on concerns
  // Use content-based filtering
  const concernTypes = concerns.map((c) => c.type);
  
  // This would query your database or WooCommerce API
  // with tags/categories matching the concerns
  const products = await searchProductsByIngredients(concernTypes);
  
  return products.slice(0, 10).map((p) => p.id);
}
```

### 2. Recommendation Engine

#### Collaborative Filtering

```typescript
// lib/ai/recommendations.ts
import { Product, User, Purchase } from '@/lib/types';

export class RecommendationEngine {
  // Collaborative filtering: Users who bought X also bought Y
  async getCollaborativeRecommendations(
    userId: number,
    limit: number = 10
  ): Promise<Product[]> {
    // Get user's purchase history
    const userPurchases = await getUserPurchases(userId);
    const purchasedProductIds = userPurchases.map((p) => p.productId);

    // Find similar users (users who bought similar products)
    const similarUsers = await findSimilarUsers(purchasedProductIds);

    // Get products that similar users bought but current user hasn't
    const recommendations = await getProductsBoughtBySimilarUsers(
      similarUsers,
      purchasedProductIds
    );

    // Rank by frequency and relevance
    return recommendations.slice(0, limit);
  }

  // Content-based filtering: Products similar to what user likes
  async getContentBasedRecommendations(
    userId: number,
    limit: number = 10
  ): Promise<Product[]> {
    // Get user's browsing history and favorites
    const userInterests = await getUserInterests(userId);

    // Find products with similar attributes (category, ingredients, etc.)
    const recommendations = await findSimilarProducts(userInterests);

    return recommendations.slice(0, limit);
  }

  // Hybrid approach
  async getPersonalizedRecommendations(
    userId: number,
    limit: number = 10
  ): Promise<Product[]> {
    const [collaborative, contentBased] = await Promise.all([
      this.getCollaborativeRecommendations(userId, limit),
      this.getContentBasedRecommendations(userId, limit),
    ]);

    // Merge and rank recommendations
    const merged = mergeRecommendations(collaborative, contentBased);

    return merged.slice(0, limit);
  }

  // Trending products
  async getTrendingProducts(limit: number = 10): Promise<Product[]> {
    // Get products with high recent engagement
    const trending = await db.query(`
      SELECT p.*, COUNT(DISTINCT o.user_id) as buyer_count
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY p.id
      ORDER BY buyer_count DESC
      LIMIT $1
    `, [limit]);

    return trending.rows;
  }

  // Context-aware recommendations
  async getContextualRecommendations(
    productId: number,
    context: 'cart' | 'product_page' | 'checkout',
    limit: number = 4
  ): Promise<Product[]> {
    switch (context) {
      case 'cart':
        return this.getFrequentlyBoughtTogether(productId, limit);
      case 'product_page':
        return this.getComplementaryProducts(productId, limit);
      case 'checkout':
        return this.getLastMinuteAddOns(productId, limit);
      default:
        return [];
    }
  }

  private async getFrequentlyBoughtTogether(
    productId: number,
    limit: number
  ): Promise<Product[]> {
    // Find products frequently bought in the same order
    const result = await db.query(`
      WITH product_pairs AS (
        SELECT 
          oi1.product_id as product1,
          oi2.product_id as product2,
          COUNT(*) as frequency
        FROM order_items oi1
        JOIN order_items oi2 ON oi1.order_id = oi2.order_id
        WHERE oi1.product_id = $1 AND oi2.product_id != $1
        GROUP BY oi1.product_id, oi2.product_id
      )
      SELECT p.*, pp.frequency
      FROM products p
      JOIN product_pairs pp ON p.id = pp.product2
      ORDER BY pp.frequency DESC
      LIMIT $2
    `, [productId, limit]);

    return result.rows;
  }
}
```

### 3. AI Chatbot

```typescript
// lib/ai/chatbot.ts
import { OpenAI } from 'openai';
import { getProduct, searchProducts } from '@/lib/api/woocommerce';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContext {
  userId?: number;
  sessionId: string;
  history: ChatMessage[];
  context: {
    currentPage?: string;
    viewedProducts?: number[];
    cartItems?: number[];
  };
}

export async function chat(
  message: string,
  context: ChatContext
): Promise<string> {
  // Build system prompt with context
  const systemPrompt = buildSystemPrompt(context);

  // Check if message requires function calling
  const functions = [
    {
      name: 'search_products',
      description: 'Search for products based on criteria',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' },
          max_price: { type: 'number' },
        },
      },
    },
    {
      name: 'get_product_details',
      description: 'Get detailed information about a specific product',
      parameters: {
        type: 'object',
        properties: {
          product_id: { type: 'number' },
        },
        required: ['product_id'],
      },
    },
    {
      name: 'recommend_products',
      description: 'Get personalized product recommendations',
      parameters: {
        type: 'object',
        properties: {
          concern: { type: 'string' },
          skin_type: { type: 'string' },
          budget: { type: 'number' },
        },
      },
    },
  ];

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...context.history,
    { role: 'user', content: message },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    functions,
    function_call: 'auto',
    temperature: 0.7,
    max_tokens: 500,
  });

  const responseMessage = response.choices[0].message;

  // Handle function calls
  if (responseMessage.function_call) {
    const functionName = responseMessage.function_call.name;
    const functionArgs = JSON.parse(responseMessage.function_call.arguments);

    let functionResult;
    switch (functionName) {
      case 'search_products':
        functionResult = await searchProducts(functionArgs.query);
        break;
      case 'get_product_details':
        functionResult = await getProduct(functionArgs.product_id);
        break;
      case 'recommend_products':
        const engine = new RecommendationEngine();
        functionResult = await engine.getPersonalizedRecommendations(
          context.userId || 0
        );
        break;
    }

    // Send function result back to GPT for natural language response
    const followUpResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        ...messages,
        responseMessage,
        {
          role: 'function',
          name: functionName,
          content: JSON.stringify(functionResult),
        },
      ],
      temperature: 0.7,
    });

    return followUpResponse.choices[0].message.content || '';
  }

  return responseMessage.content || '';
}

function buildSystemPrompt(context: ChatContext): string {
  return `You are a helpful skincare expert assistant for Dermastore, 
an online skincare store specializing in dermatologist-backed products.

Your role is to:
- Help customers find the right products for their skin concerns
- Provide expert skincare advice
- Answer questions about products, ingredients, and routines
- Assist with orders and account issues

Guidelines:
- Be friendly, professional, and empathetic
- Use scientific terminology when appropriate, but keep it accessible
- Always recommend products based on the customer's specific needs
- If unsure, offer to connect them with a human expert
- Don't make medical claims or diagnose conditions

Current context:
- User is on page: ${context.context.currentPage || 'unknown'}
- Recently viewed products: ${context.context.viewedProducts?.length || 0}
- Items in cart: ${context.context.cartItems?.length || 0}
`;
}
```

### 4. Search Enhancement with AI

```typescript
// lib/ai/search.ts
import { OpenAI } from 'openai';
import { searchProducts } from '@/lib/api/woocommerce';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function semanticSearch(query: string): Promise<Product[]> {
  // Generate embedding for search query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;

  // Search in vector database (e.g., Pinecone, Weaviate)
  const results = await vectorDB.search({
    vector: queryEmbedding,
    topK: 20,
  });

  // Fetch full product details
  const productIds = results.map((r) => r.id);
  const products = await getProductsByIds(productIds);

  return products;
}

export async function naturalLanguageSearch(query: string): Promise<Product[]> {
  // Use GPT to understand intent and extract search parameters
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Extract search parameters from user query. 
        Output JSON with: category, ingredients, concerns, priceRange, skinType`,
      },
      {
        role: 'user',
        content: query,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const searchParams = JSON.parse(response.choices[0].message.content || '{}');

  // Build WooCommerce query
  const wcParams = {
    category: searchParams.category,
    tag: [...(searchParams.ingredients || []), ...(searchParams.concerns || [])],
    min_price: searchParams.priceRange?.min,
    max_price: searchParams.priceRange?.max,
  };

  return searchProducts(wcParams);
}

// Example: "best moisturizer for dry sensitive skin under R500"
// Extracts: { concerns: ['dry', 'sensitive'], category: 'moisturizer', priceRange: { max: 500 } }
```

---

## State Management

### Zustand for Global State

```typescript
// store/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product: Product;
  quantity: number;
  variationId?: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [], total: 0 }),

      calculateTotal: () => {
        const items = get().items;
        return items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### TanStack Query for Server State

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/lib/api/woocommerce';

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: CartItem) => addToCartAPI(item),
    onSuccess: () => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
```

---

## Performance Optimization

### Image Optimization

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Low quality placeholder
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
}
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const SkinAnalysis = dynamic(() => import('@/components/ai/SkinAnalysis'), {
  loading: () => <Skeleton />,
  ssr: false, // Don't render on server
});

const Chatbot = dynamic(() => import('@/components/ai/Chatbot'), {
  loading: () => <div>Loading chat...</div>,
});
```

### Lazy Loading

```typescript
// Intersection Observer for lazy loading
import { useInView } from 'react-intersection-observer';

export function LazyProductGrid({ products }: { products: Product[] }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <ProductGrid products={products} />
      ) : (
        <Skeleton count={12} />
      )}
    </div>
  );
}
```

### Service Worker & PWA

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

---

## Security

### Environment Variables

```bash
# .env.local

# Magento 2 API
MAGENTO_API_URL=https://store.dermastore.co.za/rest/V1
MAGENTO_GRAPHQL_URL=https://store.dermastore.co.za/graphql
MAGENTO_ACCESS_TOKEN=xxxxx  # Integration access token
MAGENTO_WEBHOOK_SECRET=xxxxx
MAGENTO_MEDIA_URL=https://store.dermastore.co.za/media/catalog/product

# Magento Admin (for admin operations)
MAGENTO_ADMIN_TOKEN=xxxxx

# AI Services
OPENAI_API_KEY=sk-xxxxx
AZURE_CV_KEY=xxxxx
AZURE_CV_ENDPOINT=https://xxxxx.cognitiveservices.azure.com/

# Database (Custom services)
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379

# Auth
NEXTAUTH_URL=https://dermastore.co.za
NEXTAUTH_SECRET=xxxxx

# Payment Gateways
STRIPE_PUBLIC_KEY=pk_xxxxx
STRIPE_SECRET_KEY=sk_xxxxx
PAYFAST_MERCHANT_ID=xxxxx
PAYFAST_MERCHANT_KEY=xxxxx
```

### API Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}
```

### Input Validation

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name too short'),
  lastName: z.string().min(2, 'Last name too short'),
  phone: z.string().regex(/^\+?[\d\s-]+$/, 'Invalid phone number'),
  address: z.object({
    street: z.string().min(5, 'Address too short'),
    city: z.string().min(2, 'City required'),
    province: z.string().min(2, 'Province required'),
    postalCode: z.string().regex(/^\d{4}$/, 'Invalid postal code'),
  }),
});

// Usage in API route
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  try {
    const validatedData = checkoutSchema.parse(body);
    // Process order with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }
  }
}
```

---

## Deployment

### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare (DNS + CDN)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌──────────────────┐      ┌──────────────────────────────────┐
│  Vercel          │      │         Magento 2                 │
│  (Next.js App)   │◄────►│  (REST API + GraphQL)            │
└──────────────────┘      │                                   │
         │                │  ┌───────────┐  ┌─────────────┐  │
         │                │  │   MySQL   │  │Elasticsearch│  │
         │                │  └───────────┘  └─────────────┘  │
         │                │  ┌───────────┐  ┌─────────────┐  │
         │                │  │  Varnish  │  │   Redis     │  │
         │                │  │  (Cache)  │  │  (Session)  │  │
         │                │  └───────────┘  └─────────────┘  │
         │                └──────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│                    AI Services Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Azure CV    │  │   OpenAI     │  │  Custom ML   │    │
│  │  (Vision)    │  │   (NLP)      │  │  (Recommend) │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Database migrations run
- [ ] Cache warmed up
- [ ] CDN configured
- [ ] SSL certificates installed
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Performance testing done
- [ ] Security audit passed

---

**Version**: 1.0  
**Last Updated**: January 7, 2026  
**Maintained By**: Dermastore Development Team
