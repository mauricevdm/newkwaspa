import type { Metadata } from 'next';
import { CartClient } from './cart-client';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your items and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="font-heading text-3xl font-bold md:text-4xl">Shopping Cart</h1>
      <CartClient />
    </div>
  );
}
