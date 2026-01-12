/**
 * Product Adapter
 * 
 * Maps API Product types to component-expected Product types.
 * This allows the UI components to remain unchanged while using the new API layer.
 */

import type { Product as ApiProduct } from '@/lib/api/types';
import type { Product as ComponentProduct } from '@/components/product/product-card';

/**
 * Convert API Product to Component Product format
 */
export function toComponentProduct(apiProduct: ApiProduct): ComponentProduct {
  // The API price structure has: amount, currency, formatted, compareAtAmount (optional for sale price)
  const isOnSale = apiProduct.price.compareAtAmount !== undefined;
  const price = apiProduct.price.amount;
  const originalPrice = isOnSale ? apiProduct.price.compareAtAmount : undefined;

  // Check for isNew/isBestSeller in attributes array
  const isNewAttr = apiProduct.attributes?.find(a => a.code === 'isNew' || a.name === 'isNew');
  const isBestSellerAttr = apiProduct.attributes?.find(a => a.code === 'isBestSeller' || a.name === 'isBestSeller');

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    brand: apiProduct.brand?.name || '',
    price,
    originalPrice,
    image: apiProduct.images[0]?.url || '/images/placeholder-product.jpg',
    rating: apiProduct.rating?.average,
    reviewCount: apiProduct.rating?.count,
    isNew: isNewAttr?.value === 'true' || isNewAttr?.value === '1',
    isBestSeller: isBestSellerAttr?.value === 'true' || isBestSellerAttr?.value === '1',
    inStock: apiProduct.stock?.inStock ?? true,
  };
}

/**
 * Convert multiple API Products to Component Product format
 */
export function toComponentProducts(apiProducts: ApiProduct[]): ComponentProduct[] {
  return apiProducts.map(toComponentProduct);
}

/**
 * Convert Component Product format back to cart-compatible format
 */
export function toCartItem(product: ComponentProduct, quantity = 1) {
  return {
    id: product.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    quantity,
  };
}
