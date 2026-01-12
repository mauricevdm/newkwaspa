'use client';

import { ProductCard } from '@/components/product/product-card';
import { useFeaturedProducts } from '@/lib/api/hooks';
import { toComponentProducts } from '@/lib/api/adapters';

export function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts(4);
  const products = data ? toComponentProducts(data) : [];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/5] rounded-lg bg-secondary" />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
