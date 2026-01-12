# Dermastore React Component Library

## Complete Component Specifications

---

## Table of Contents
1. [Component Architecture](#component-architecture)
2. [UI Components (Atoms)](#ui-components-atoms)
3. [Composite Components (Molecules)](#composite-components-molecules)
4. [Complex Components (Organisms)](#complex-components-organisms)
5. [Page Templates](#page-templates)
6. [AI/ML Components](#aiml-components)
7. [Hooks Library](#hooks-library)
8. [Utilities & Helpers](#utilities--helpers)

---

## Component Architecture

### Design Principles

1. **Composability**: Build complex UIs from simple, reusable components
2. **Accessibility**: WCAG 2.1 AA compliant by default
3. **Type Safety**: Full TypeScript support with strict types
4. **Performance**: Optimized with React.memo, lazy loading
5. **Consistency**: Aligned with style guide tokens

### Naming Conventions

```
ComponentName/
├── index.tsx              # Main component
├── ComponentName.tsx      # Implementation
├── ComponentName.test.tsx # Tests
├── ComponentName.stories.tsx # Storybook stories
├── ComponentName.module.css  # Styles (if needed)
└── types.ts              # TypeScript types
```

### Base Props Interface

```typescript
// lib/types/component.ts
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  testId?: string;
}

export interface ClickableProps extends BaseProps {
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  ariaLabel?: string;
}
```

---

## UI Components (Atoms)

### 1. Button

```typescript
// components/ui/Button/Button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: 'bg-primary-teal text-white hover:bg-primary-teal-light focus:ring-primary-teal disabled:bg-gray-300',
      secondary: 'border-2 border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white focus:ring-primary-teal',
      text: 'text-primary-teal hover:underline focus:ring-primary-teal',
      danger: 'bg-error text-white hover:bg-error/90 focus:ring-error',
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5 h-8',
      md: 'text-base px-6 py-2.5 h-10',
      lg: 'text-lg px-8 py-3 h-12',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Usage:**
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Add to Cart
</Button>

<Button variant="secondary" isLoading>
  Processing...
</Button>

<Button variant="text" leftIcon={<ArrowLeftIcon />}>
  Back
</Button>
```

---

### 2. Input

```typescript
// components/ui/Input/Input.tsx
import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 text-base text-gray-800 bg-white border rounded-md transition-colors',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-error focus:ring-error'
                : 'border-gray-300 focus:border-primary-teal focus:ring-primary-teal',
              props.disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-error">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={`${inputId}-help`} className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

---

### 3. Badge

```typescript
// components/ui/Badge/Badge.tsx
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new' | 'bestseller' | 'outofstock' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full uppercase tracking-wide';

  const variants = {
    sale: 'bg-accent-coral text-white',
    new: 'bg-accent-gold text-gray-900',
    bestseller: 'bg-primary-teal text-white',
    outofstock: 'bg-gray-400 text-white',
    default: 'bg-gray-200 text-gray-700',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
```

---

### 4. Rating

```typescript
// components/ui/Rating/Rating.tsx
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  value: number; // 0-5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Rating({
  value,
  maxStars = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const stars = Array.from({ length: maxStars }, (_, index) => {
    const starValue = index + 1;
    const filled = value >= starValue;
    const half = value >= starValue - 0.5 && value < starValue;

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(starValue)}
        className={cn(
          'text-accent-gold',
          interactive && 'cursor-pointer hover:scale-110 transition-transform'
        )}
        aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
      >
        {filled ? (
          <Star className={cn(sizes[size], 'fill-current')} />
        ) : half ? (
          <StarHalf className={cn(sizes[size], 'fill-current')} />
        ) : (
          <Star className={cn(sizes[size])} />
        )}
      </button>
    );
  });

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">{stars}</div>
      {showValue && <span className="text-sm font-medium ml-1">{value.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
```

---

### 5. Select

```typescript
// components/ui/Select/Select.tsx
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helpText,
      placeholder,
      fullWidth = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-2.5 text-base text-gray-800 bg-white border rounded-md appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              error
                ? 'border-error focus:ring-error'
                : 'border-gray-300 focus:border-primary-teal focus:ring-primary-teal',
              props.disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${selectId}-error` : helpText ? `${selectId}-help` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-xs text-error">
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={`${selectId}-help`} className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
```

---

## Composite Components (Molecules)

### 1. ProductCard

```typescript
// components/shop/ProductCard/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToWishlist?: (productId: number) => void;
  onAddToCart?: (productId: number) => void;
  className?: string;
}

export function ProductCard({
  product,
  onQuickView,
  onAddToWishlist,
  onAddToCart,
  className,
}: ProductCardProps) {
  const discountPercentage = product.salePrice
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  return (
    <div
      className={cn(
        'group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300',
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0]?.src || '/placeholder.jpg'}
          alt={product.images[0]?.alt || product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.onSale && <Badge variant="sale">-{discountPercentage}%</Badge>}
          {product.featured && <Badge variant="bestseller">Bestseller</Badge>}
          {product.dateCreated && isNew(product.dateCreated) && (
            <Badge variant="new">New</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onAddToWishlist && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToWishlist(product.id);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-teal hover:text-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-teal hover:text-white transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stockStatus === 'outofstock' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="outofstock" size="md">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-sm text-gray-500 mb-1">{product.brand || 'Dermastore'}</p>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2 hover:text-primary-teal transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <Rating
          value={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
          className="mb-2"
        />

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.onSale && product.regularPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.regularPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && product.stockStatus === 'instock' && (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onAddToCart(product.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}

function isNew(dateCreated: string): boolean {
  const created = new Date(dateCreated);
  const now = new Date();
  const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 30; // New if created within last 30 days
}
```

---

### 2. SearchBar

```typescript
// components/layout/SearchBar/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { searchProducts } from '@/lib/api/woocommerce';
import type { Product } from '@/lib/types';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search for products, brands, concerns...',
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search on debounced query change
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      searchProducts(debouncedQuery)
        .then(setResults)
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const showDropdown = isFocused && (query.length >= 2 || query.length === 0);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          leftIcon={<Search className="w-5 h-5" />}
          rightIcon={
            query && (
              <button
                type="button"
                onClick={clearSearch}
                className="hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )
          }
          className="pr-10"
        />
      </form>

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {query.length === 0 ? (
            // Show popular searches when empty
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </h3>
              <div className="space-y-1">
                {['Retinol', 'Vitamin C', 'Sunscreen', 'Hyaluronic Acid'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Products ({results.length})
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 border-t border-gray-100"
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={product.images[0]?.src || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 3. CartItem

```typescript
// components/cart/CartItem/CartItem.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/lib/types';

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  className?: string;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  className,
}: CartItemProps) {
  const { product, quantity, variationId } = item;
  const subtotal = product.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className={cn('flex gap-4 py-4 border-b border-gray-200', className)}>
      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-32">
          <Image
            src={product.images[0]?.src || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-base font-medium text-gray-900 hover:text-primary-teal transition-colors">
                {product.name}
              </h3>
            </Link>
            {variationId && (
              <p className="text-sm text-gray-600 mt-1">
                Size: {product.variations?.find((v) => v.id === variationId)?.attributes}
              </p>
            )}
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(product.id)}
            className="text-gray-400 hover:text-error transition-colors"
            aria-label="Remove item"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-12 text-center border-x border-gray-300 focus:outline-none"
              min="1"
              max="99"
              aria-label="Quantity"
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99}
              className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(subtotal)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-gray-500">
                {formatPrice(product.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Complex Components (Organisms)

### 1. Header

```typescript
// components/layout/Header/Header.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Menu, User, Heart, ShoppingCart } from 'lucide-react';
import { SearchBar } from '../SearchBar';
import { MegaMenu } from './MegaMenu';
import { useCart } from '@/lib/hooks/useCart';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary-teal text-white text-center py-2 text-sm">
        Free delivery on all orders over R750 🎁
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo.svg"
                alt="Dermastore"
                className="h-12 w-auto"
              />
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="p-2 hover:text-primary-teal transition-colors"
                aria-label="Account"
              >
                <User className="w-6 h-6" />
              </Link>

              <Link
                href="/wishlist"
                className="p-2 hover:text-primary-teal transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-6 h-6" />
              </Link>

              <Link
                href="/cart"
                className="relative p-2 hover:text-primary-teal transition-colors"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-coral text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden lg:block border-t border-gray-200">
            <ul className="flex items-center gap-8 h-14">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-700 hover:text-primary-teal font-medium transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-gray-700 hover:text-primary-teal font-medium transition-colors"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/concerns"
                  className="text-gray-700 hover:text-primary-teal font-medium transition-colors"
                >
                  Skin Concerns
                </Link>
              </li>
              <li>
                <Link
                  href="/skin-analysis"
                  className="text-primary-teal hover:text-primary-teal-dark font-medium transition-colors"
                >
                  Skin Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-primary-teal font-medium transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="lg:hidden px-4 pb-4">
          <SearchBar />
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMenuOpen(false)}>
          <div
            className="bg-white w-80 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile menu content */}
          </div>
        </div>
      )}
    </>
  );
}
```

---

### 2. ProductGrid

```typescript
// components/shop/ProductGrid/ProductGrid.tsx
import { ProductCard } from '../ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/lib/types';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  onQuickView?: (product: Product) => void;
  onAddToWishlist?: (productId: number) => void;
  onAddToCart?: (productId: number) => void;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  columns = 4,
  onQuickView,
  onAddToWishlist,
  onAddToCart,
  className,
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={cn('grid gap-6', gridCols[columns], className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/5] rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          onAddToWishlist={onAddToWishlist}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
```

---

## AI/ML Components

### 1. SkinAnalysis Component

```typescript
// components/ai/SkinAnalysis/SkinAnalysis.tsx
import { useState } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { analyzeSkin } from '@/lib/ai/skin-analysis';
import { AnalysisResults } from './AnalysisResults';
import type { SkinAnalysis as SkinAnalysisType } from '@/lib/types';

export function SkinAnalysis() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SkinAnalysisType | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/ai/analyze-skin', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const analysisResults = await response.json();
      setResults(analysisResults);
    } catch (error) {
      console.error('Analysis error:', error);
      // Show error toast
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (results) {
    return (
      <AnalysisResults
        results={results}
        imageUrl={previewUrl!}
        onReset={() => {
          setResults(null);
          setImage(null);
          setPreviewUrl(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Skin Analysis
        </h1>
        <p className="text-gray-600">
          Upload a clear photo of your face to get personalized skincare recommendations
        </p>
      </div>

      {previewUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                setImage(null);
                setPreviewUrl(null);
              }}
            >
              Choose Different Photo
            </Button>
            <Button
              variant="primary"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Skin'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-teal transition-colors">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG or HEIC (max 10MB)
              </p>
            </div>
          </label>

          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">Or</p>
            <Button variant="secondary" leftIcon={<Camera />}>
              Take Photo
            </Button>
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">For best results:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Use good lighting (natural light preferred)</li>
          <li>Face the camera directly</li>
          <li>Remove makeup if possible</li>
          <li>Ensure your entire face is visible</li>
        </ul>
      </div>
    </div>
  );
}
```

---

## Hooks Library

### useCart Hook

```typescript
// lib/hooks/useCart.ts
import { useCartStore } from '@/store/cart';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCart() {
  const queryClient = useQueryClient();
  const store = useCartStore();

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart');
    },
    onError: () => {
      toast.error('Failed to add to cart');
    },
  });

  return {
    items: store.items,
    total: store.calculateTotal(),
    itemCount: store.items.reduce((sum, item) => sum + item.quantity, 0),
    addToCart: (productId: number, quantity: number = 1) => {
      addToCartMutation.mutate({ productId, quantity });
    },
    removeFromCart: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  };
}
```

---

**Version**: 1.0  
**Last Updated**: January 7, 2026  
**Maintained By**: Dermastore Development Team
