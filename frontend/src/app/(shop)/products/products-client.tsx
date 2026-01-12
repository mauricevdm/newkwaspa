'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductGrid } from '@/components/product';
import { ProductFilters } from './product-filters';
import { useProducts } from '@/lib/api/hooks';
import { toComponentProducts } from '@/lib/api/adapters';

interface ProductsClientProps {
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

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export function ProductsClient({ searchParams }: ProductsClientProps) {
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const currentSort = searchParams.sort || 'featured';
  const currentPage = parseInt(searchParams.page || '1', 10);

  // Map sort options to API params (ProductSortOption type)
  const getSort = (): 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'best-selling' | 'rating' => {
    switch (currentSort) {
      case 'price-asc':
        return 'price-asc';
      case 'price-desc':
        return 'price-desc';
      case 'newest':
        return 'newest';
      case 'rating':
        return 'rating';
      case 'best-selling':
        return 'best-selling';
      default:
        return 'name-asc';
    }
  };

  // Fetch products using the API hook
  const { data, isLoading, error } = useProducts({
    page: currentPage,
    pageSize: 12,
    categorySlug: searchParams.category,
    brandSlug: searchParams.brand,
    search: searchParams.q,
    sort: getSort(),
  });

  const products = data?.items ? toComponentProducts(data.items) : [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', value);
    params.delete('page'); // Reset to page 1 on sort change
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex gap-8">
      {/* Desktop Filters Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <ProductFilters />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {totalProducts} products
          </p>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters onApply={() => setMobileFiltersOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchParams.category || searchParams.brand || searchParams.sale) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searchParams.category && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.delete('category');
                  router.push(`/products?${params.toString()}`);
                }}
              >
                Category: {searchParams.category}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {searchParams.brand && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.delete('brand');
                  router.push(`/products?${params.toString()}`);
                }}
              >
                Brand: {searchParams.brand}
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            {searchParams.sale && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.delete('sale');
                  router.push(`/products?${params.toString()}`);
                }}
              >
                On Sale
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-destructive">Failed to load products. Please try again.</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && (
          <>
            <ProductGrid products={products} columns={3} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
