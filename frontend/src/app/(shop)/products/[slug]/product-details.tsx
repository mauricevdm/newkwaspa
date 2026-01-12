'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { cn, formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sku: string;
  size: string;
  skinType: string[];
  concerns: string[];
  ingredients: string;
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  const addItem = useCartStore((state) => state.addItem);

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      quantity,
    });
  };

  return (
    <div className="container-custom py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square overflow-hidden rounded-lg bg-secondary"
          >
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="text-center text-muted-foreground">{product.name}</span>
            </div>
          </motion.div>
          
          {/* Thumbnails */}
          <div className="flex gap-4">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'aspect-square w-20 overflow-hidden rounded-lg border-2 bg-secondary transition-all',
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                )}
              >
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/brands/${product.brand.toLowerCase()}`}
              className="text-sm font-medium uppercase tracking-wide text-primary hover:underline"
            >
              {product.brand}
            </Link>
            <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-5 w-5',
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-muted text-muted'
                  )}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {isOnSale && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
                <Badge variant="destructive">-{discountPercent}%</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Size */}
          <div>
            <span className="text-sm text-muted-foreground">Size: </span>
            <span className="font-medium">{product.size}</span>
          </div>

          {/* Skin Type */}
          <div className="flex flex-wrap gap-2">
            {product.skinType.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center rounded-md border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-12 w-12 items-center justify-center hover:bg-secondary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-12 w-12 items-center justify-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-12 w-12 items-center justify-center hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-sm">
            <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
              {product.inStock ? '● In Stock' : '● Out of Stock'}
            </span>
            <span className="text-muted-foreground">SKU: {product.sku}</span>
          </div>

          {/* Features */}
          <div className="grid gap-4 border-t pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over R500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Authentic</p>
                <p className="text-xs text-muted-foreground">100% genuine products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex gap-8 border-b">
          {(['description', 'ingredients', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-4 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
          )}
          {activeTab === 'ingredients' && (
            <div className="max-w-2xl">
              <h3 className="mb-4 font-semibold">Full Ingredients List</h3>
              <p className="text-sm text-muted-foreground">{product.ingredients}</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Reviews coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
