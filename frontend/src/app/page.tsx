import Link from 'next/link';
import Image from 'next/image';
import { HeroBanner } from '@/components/home/hero-banner';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategoryGrid } from '@/components/home/category-grid';
import { BrandCarousel } from '@/components/home/brand-carousel';
import { PromoBanner } from '@/components/home/promo-banner';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Truck, Shield, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroBanner />

      {/* Features Bar */}
      <section className="border-b bg-secondary/30 py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Free Shipping</p>
                <p className="text-sm text-muted-foreground">On orders over R500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Authentic Products</p>
                <p className="text-sm text-muted-foreground">100% genuine brands</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Expert Advice</p>
                <p className="text-sm text-muted-foreground">Dermatologist recommended</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">AI Skin Analysis</p>
                <p className="text-sm text-muted-foreground">Personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-3 text-muted-foreground">
              Find the perfect products for your skincare routine
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/30 py-16">
        <div className="container-custom">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                Featured Products
              </h2>
              <p className="mt-3 text-muted-foreground">
                Bestsellers and staff favorites
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden md:flex">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <FeaturedProducts />
          <div className="mt-8 text-center md:hidden">
            <Link href="/products">
              <Button variant="outline">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Skin Analysis CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-700 text-white">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <span className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm">
                  <Sparkles className="mr-2 h-4 w-4" /> AI Powered
                </span>
                <h2 className="font-heading text-3xl font-bold md:text-4xl">
                  Discover Your Perfect Skincare Routine
                </h2>
                <p className="mt-4 text-lg text-white/90">
                  Use our AI-powered skin analysis to get personalized product
                  recommendations based on your unique skin type and concerns.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/skin-analysis">
                    <Button size="lg" variant="secondary">
                      Try Skin Analysis
                    </Button>
                  </Link>
                  <Link href="/routine-builder">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Build My Routine
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden h-80 md:block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-64 w-64 rounded-full bg-white/10">
                    <div className="absolute inset-4 rounded-full bg-white/20" />
                    <div className="absolute inset-8 rounded-full bg-white/30" />
                    <div className="absolute inset-12 flex items-center justify-center rounded-full bg-white">
                      <Sparkles className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />

      {/* Brand Carousel */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Shop by Brand
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover premium skincare brands we trust
            </p>
          </div>
          <BrandCarousel />
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t bg-secondary/30 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold">
              Join Our Newsletter
            </h2>
            <p className="mt-3 text-muted-foreground">
              Subscribe to get exclusive offers, skincare tips, and be the first
              to know about new arrivals.
            </p>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
                required
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates from us.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
