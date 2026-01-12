# Plan: Pluggable Backend API Layer

## Status: ✅ COMPLETED

All components implemented. See usage examples below.

## Current State

The codebase now has a complete API abstraction layer with:
- **Mock Provider** (default): Full implementation with 25 products, localStorage cart, simulated delays
- **Magento Provider**: Wraps existing GraphQL client with type mappers
- **React Query hooks**: Cached, reactive data fetching

## Architecture

```
frontend/src/lib/api/
├── types.ts              # Shared types (Product, Cart, User, etc.)
├── interface.ts          # Abstract interface for all backends
├── index.ts              # Export active provider based on config
├── hooks.ts              # React Query hooks consuming provider
├── providers/
│   ├── mock/             # Mock data provider (default)
│   │   ├── index.ts
│   │   ├── data/
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   └── users.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── auth.ts
│   │   └── categories.ts
│   └── magento/          # Magento provider
│       ├── index.ts
│       ├── client.ts     # (move existing)
│       ├── queries.ts    # (move existing)
│       ├── mutations.ts  # (move existing)
│       └── mappers.ts    # Transform Magento types to unified types
```

## Steps

### Step 1: Create unified type definitions
**File:** `frontend/src/lib/api/types.ts`

Define `Product`, `Cart`, `CartItem`, `User`, `Category`, `Order`, `Address`, `CheckoutSession` types independent of any backend schema.

### Step 2: Define provider interface
**File:** `frontend/src/lib/api/interface.ts`

Abstract `ApiProvider` interface with namespaces:
- `products` - getAll, getBySlug, search, getByCategory
- `cart` - get, addItem, updateItem, removeItem, clear
- `auth` - login, register, logout, getUser, updateUser
- `categories` - getAll, getBySlug, getTree
- `checkout` - createSession, setShippingAddress, setBillingAddress, setPaymentMethod, placeOrder

### Step 3: Build mock provider
**Directory:** `frontend/src/lib/api/providers/mock/`

- Consolidate existing mock data from components
- Add realistic delays to simulate network latency
- Support filtering, pagination, sorting
- Store cart/auth state in memory (or localStorage for persistence)

### Step 4: Wrap existing Magento client
**Directory:** `frontend/src/lib/api/providers/magento/`

- Move existing `client.ts`, `queries.ts`, `mutations.ts`
- Create `mappers.ts` to transform Magento GraphQL responses to unified types
- Implement the `ApiProvider` interface

### Step 5: Create provider factory
**File:** `frontend/src/lib/api/index.ts`

```typescript
// Runtime selection via NEXT_PUBLIC_API_PROVIDER env variable
export function getApiProvider(): ApiProvider {
  const provider = process.env.NEXT_PUBLIC_API_PROVIDER || 'mock';
  switch (provider) {
    case 'magento': return magentoProvider;
    // case 'woocommerce': return woocommerceProvider;
    default: return mockProvider;
  }
}

export const api = getApiProvider();
```

### Step 6: Add React Query hooks
**File:** `frontend/src/lib/api/hooks.ts`

- `useProducts(params?)` - List products with filters
- `useProduct(slug)` - Single product by slug
- `useCategories()` - Category tree
- `useCart()` - Current cart with mutations
- `useAuth()` - Auth state with login/logout/register

### Step 7: Refactor consuming components

Update pages to use new hooks instead of hardcoded data:
- `products/products-client.tsx` → `useProducts()`
- `products/[slug]/page.tsx` → `useProduct(slug)`
- `cart/cart-client.tsx` → `useCart()`
- `login/page.tsx` → `useAuth().login()`

## Decisions (Finalized)

### Cart Strategy
- [x] **Option C: Hybrid (Selected)** - Client-side optimistic updates with background sync
  - Guest users: Cart stored in localStorage, synced to server on checkout or login
  - Logged-in users: Optimistic local updates → async API sync → reconcile on page load
  - Cart merge: On login, merge guest cart with existing server cart
  - Benefits: Instant UX, works offline, persists across devices, supports guest checkout

### Authentication Strategy
- [x] **Option A: JWT in httpOnly cookie (Selected)**
  - Access token (short-lived, 15-60 min) in httpOnly cookie
  - Refresh token (long-lived, 7-30 days) in httpOnly cookie, separate endpoint
  - CSRF protection via SameSite=Strict
  - Token rotation on each refresh
  - Next.js API routes handle cookie operations server-side
  - Benefits: XSS-proof, automatic browser handling, works with SSR

### Mock Data Behavior
- [x] Simulate 200-500ms delays to mimic real network latency
- [x] Persist cart in localStorage for consistent testing
- [x] Include 20-30 products with realistic South African skincare data

## Environment Configuration

```env
# .env.local
NEXT_PUBLIC_API_PROVIDER=mock  # mock | magento

# For Magento provider
NEXT_PUBLIC_MAGENTO_GRAPHQL_URL=https://magento.dermastore.co.za/graphql
```

## Usage Examples

### 1. Setup Provider in Layout

```tsx
// app/layout.tsx
import { ApiQueryProvider } from '@/lib/api/provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApiQueryProvider>{children}</ApiQueryProvider>
      </body>
    </html>
  );
}
```

### 2. Fetch Products

```tsx
'use client';
import { useProducts } from '@/lib/api/hooks';

export function ProductGrid() {
  const { data, isLoading, error } = useProducts({
    categoryId: 'serums',
    page: 1,
    pageSize: 12,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 3. Add to Cart

```tsx
'use client';
import { useCart, useAddToCart } from '@/lib/api/hooks';

export function AddToCartButton({ productId }: { productId: string }) {
  const { data: cart } = useCart();
  const addToCart = useAddToCart();

  return (
    <button
      onClick={() => addToCart.mutate({ productId, quantity: 1 })}
      disabled={addToCart.isPending}
    >
      {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### 4. Direct API Access (Server Components)

```tsx
// Server component - direct API access
import { api } from '@/lib/api';

export default async function ProductPage({ params }) {
  const product = await api.products.getProductBySlug(params.slug);
  return <ProductDetail product={product} />;
}
```

## Future Backend Support

To add a new backend (e.g., WooCommerce):

1. Create `frontend/src/lib/api/providers/woocommerce/`
2. Implement `ApiProvider` interface
3. Add case to provider factory switch statement
4. Set `NEXT_PUBLIC_API_PROVIDER=woocommerce`
