import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsClient } from './products-client';
import { ProductsLoading } from './loading';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our complete collection of premium skincare products. Find cleansers, moisturizers, serums, and more from top dermatologist-recommended brands.',
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
    q?: string;
    sale?: string;
    concern?: string;
    priceMin?: string;
    priceMax?: string;
  };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container-custom py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">
          Shop All Products
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover our curated collection of premium skincare products
        </p>
      </div>
      
      <Suspense fallback={<ProductsLoading />}>
        <ProductsClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
