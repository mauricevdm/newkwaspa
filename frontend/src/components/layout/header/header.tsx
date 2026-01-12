'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Heart,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart-store';
import { cn } from '@/lib/utils';
import { PromoBanner } from './promo-banner';

const navigation = [
  {
    name: 'Shop',
    href: '/products',
    children: [
      { name: 'All Products', href: '/products' },
      { name: 'Best Sellers', href: '/products?sort=best-selling' },
      { name: 'New Arrivals', href: '/products?sort=newest' },
      { name: 'Gift Vouchers', href: '/products?category=gift-vouchers' },
    ],
  },
  {
    name: 'Brands',
    href: '/brands',
    children: [
      { name: 'All Brands', href: '/brands' },
      { name: 'SkinCeuticals', href: '/brands/skinceuticals' },
      { name: 'NeoStrata', href: '/brands/neostrata' },
      { name: 'Lamelle', href: '/brands/lamelle' },
      { name: 'La Roche-Posay', href: '/brands/la-roche-posay' },
      { name: 'dermalogica', href: '/brands/dermalogica' },
      { name: "Kiehl's", href: '/brands/kiehls' },
      { name: 'pHformula', href: '/brands/phformula' },
    ],
  },
  {
    name: 'Skin Concerns',
    href: '/concerns',
    children: [
      { name: 'Acne & Breakouts', href: '/concerns/acne' },
      { name: 'Aging & Wrinkles', href: '/concerns/aging' },
      { name: 'Pigmentation', href: '/concerns/hyperpigmentation' },
      { name: 'Dryness', href: '/concerns/dryness' },
      { name: 'Sensitivity & Redness', href: '/concerns/sensitivity' },
      { name: 'Sun Protection', href: '/concerns/sun-protection' },
    ],
  },
  {
    name: 'AI Tools',
    href: '/ai',
    icon: Sparkles,
    children: [
      { name: 'Skin Analysis', href: '/skin-analysis' },
      { name: 'Routine Builder', href: '/routine-builder' },
      { name: 'Product Finder', href: '/product-finder' },
      { name: 'Video Consultations', href: '/consultations' },
    ],
  },
  { name: 'Podcast', href: '/podcast' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 shadow-sm backdrop-blur-md'
          : 'bg-white'
      )}
    >
      {/* Scrolling Promo Banner */}
      <PromoBanner />

      {/* Main Header */}
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 py-2 text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="ml-4 flex flex-col gap-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="py-1 text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-heading text-2xl font-bold text-primary">
              Dermastore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href && 'text-primary'
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                  {item.children && <ChevronDown className="h-4 w-4" />}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-50 w-48 rounded-md border bg-white py-2 shadow-lg"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm hover:bg-secondary"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* Account */}
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t"
          >
            <div className="container-custom py-4">
              <div className="relative mx-auto max-w-2xl">
                <Input
                  type="search"
                  placeholder="Search products, brands, or concerns..."
                  className="h-12 pr-12"
                  icon={<Search className="h-5 w-5" />}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
