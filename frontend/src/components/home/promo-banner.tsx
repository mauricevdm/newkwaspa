'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="bg-primary py-12 text-white md:py-16">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              New Customer? Get 15% Off
            </h2>
            <p className="mt-2 text-white/80">
              Use code WELCOME15 at checkout for your first order.
            </p>
          </div>
          <Link href="/products">
            <Button variant="secondary" size="lg">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
