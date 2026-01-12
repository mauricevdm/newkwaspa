'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore, type CartItem } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 border-b py-6">
      {/* Image */}
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <span className="text-xs text-muted-foreground">Image</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.slug}`}
            className="font-medium hover:text-primary"
          >
            {item.name}
          </Link>
          {item.variant && (
            <p className="text-sm text-muted-foreground">
              {item.variant.name}
              {item.variant.size && ` - ${item.variant.size}`}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center rounded-md border">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center hover:bg-secondary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-8 w-8 items-center justify-center text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center hover:bg-secondary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
        {item.originalPrice && item.originalPrice > item.price && (
          <p className="text-sm text-muted-foreground line-through">
            {formatPrice(item.originalPrice * item.quantity)}
          </p>
        )}
      </div>
    </div>
  );
}

export function CartClient() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 500 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-secondary p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="mt-6 font-heading text-2xl font-semibold">
          Your cart is empty
        </h2>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven&apos;t added any products yet.
        </p>
        <Link href="/products" className="mt-8">
          <Button size="lg">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between border-b pb-4">
          <span className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}

        <div className="mt-6">
          <Link href="/products">
            <Button variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Coupon */}
            <div className="flex gap-2">
              <Input
                placeholder="Coupon code"
                className="flex-1"
              />
              <Button variant="outline">
                <Tag className="mr-2 h-4 w-4" />
                Apply
              </Button>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(500 - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Including VAT where applicable
              </p>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
              <span>🔒 Secure checkout</span>
              <span>💳 Multiple payment options</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
