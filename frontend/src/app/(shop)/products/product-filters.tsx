'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  onApply?: () => void;
}

const categories = [
  { id: 'cleansers', name: 'Cleansers', count: 45 },
  { id: 'moisturizers', name: 'Moisturizers', count: 62 },
  { id: 'serums', name: 'Serums', count: 38 },
  { id: 'sunscreens', name: 'Sunscreens', count: 28 },
  { id: 'masks', name: 'Masks & Treatments', count: 24 },
  { id: 'eye-care', name: 'Eye Care', count: 18 },
  { id: 'toners', name: 'Toners', count: 31 },
];

const brands = [
  { id: 'environ', name: 'Environ', count: 32 },
  { id: 'lamelle', name: 'Lamelle', count: 28 },
  { id: 'heliocare', name: 'Heliocare', count: 15 },
  { id: 'skinceuticals', name: 'SkinCeuticals', count: 24 },
  { id: 'dermalogica', name: 'Dermalogica', count: 19 },
  { id: 'obagi', name: 'Obagi', count: 12 },
];

const concerns = [
  { id: 'acne', name: 'Acne & Breakouts', count: 42 },
  { id: 'aging', name: 'Aging & Wrinkles', count: 56 },
  { id: 'hyperpigmentation', name: 'Dark Spots', count: 38 },
  { id: 'dryness', name: 'Dryness', count: 45 },
  { id: 'sensitivity', name: 'Sensitivity', count: 29 },
  { id: 'oiliness', name: 'Oily Skin', count: 33 },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-4">
      <button
        className="flex w-full items-center justify-between py-2 text-left font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}

export function ProductFilters({ onApply }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');

  const currentCategory = searchParams.get('category');
  const currentBrand = searchParams.get('brand');
  const currentConcern = searchParams.get('concern');
  const onSale = searchParams.get('sale') === 'true';

  const applyFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
    onApply?.();
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceMin) {
      params.set('priceMin', priceMin);
    } else {
      params.delete('priceMin');
    }
    if (priceMax) {
      params.set('priceMax', priceMax);
    } else {
      params.delete('priceMax');
    }
    router.push(`/products?${params.toString()}`);
    onApply?.();
  };

  const clearAllFilters = () => {
    router.push('/products');
    onApply?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear all
        </Button>
      </div>

      {/* On Sale */}
      <FilterSection title="Sale">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => applyFilter('sale', e.target.checked ? 'true' : null)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm">On Sale Only</span>
        </label>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={currentCategory === category.id}
                onChange={() => applyFilter('category', category.id)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="flex-1 text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="brand"
                checked={currentBrand === brand.id}
                onChange={() => applyFilter('brand', brand.id)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="flex-1 text-sm">{brand.name}</span>
              <span className="text-xs text-muted-foreground">({brand.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Skin Concerns */}
      <FilterSection title="Skin Concern">
        <div className="space-y-2">
          {concerns.map((concern) => (
            <label key={concern.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="concern"
                checked={currentConcern === concern.id}
                onChange={() => applyFilter('concern', concern.id)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="flex-1 text-sm">{concern.name}</span>
              <span className="text-xs text-muted-foreground">({concern.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="h-9"
            />
            <span className="flex items-center text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="h-9"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={applyPriceFilter}>
            Apply
          </Button>
        </div>
      </FilterSection>
    </div>
  );
}
