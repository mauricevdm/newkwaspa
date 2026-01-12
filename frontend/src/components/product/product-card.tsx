'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { cn, formatPrice } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(product.image) && product.image !== '/images/placeholder-product.jpg';
  const showImage = hasImage && !imageError;
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn('group', className)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="product-card">
          {/* Image Container */}
          <div className="relative aspect-product overflow-hidden bg-secondary">
            {showImage ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                onError={() => setImageError(true)}
                priority={false}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <span className="text-center text-sm text-muted-foreground line-clamp-3 px-3">
                  {product.name}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge variant="new">New</Badge>
              )}
              {product.isBestSeller && (
                <Badge variant="default">Best Seller</Badge>
              )}
              {isOnSale && (
                <Badge variant="destructive">-{discountPercent}%</Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart Button (on hover) */}
            <div className="absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <Button
                className="w-full"
                size="sm"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </p>
            <h3 className="mt-1 line-clamp-2 font-medium leading-tight">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold">
                {product.price > 0 ? formatPrice(product.price) : 'Price unavailable'}
              </span>
              {isOnSale && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
