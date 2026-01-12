import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Headphones, Apple, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Footer structure matching dermastore.co.za
const footerLinks = {
  shopByTopRange: [
    { name: 'SkinCeuticals', href: '/brands/skinceuticals' },
    { name: 'NeoStrata', href: '/brands/neostrata' },
    { name: 'MartiDerm', href: '/brands/martiderm' },
    { name: 'Huxley', href: '/brands/huxley' },
    { name: 'Jorgobé', href: '/brands/jorgobe' },
    { name: 'Lamelle', href: '/brands/lamelle' },
    { name: 'pHformula', href: '/brands/phformula' },
    { name: 'Melumé Skinscience', href: '/brands/melume' },
    { name: 'Mesoestetic', href: '/brands/mesoestetic' },
  ],
  customerExperience: [
    { name: 'Help Center', href: 'https://help.dermastore.co.za' },
    { name: 'Become a Member', href: '/register' },
    { name: 'Video Consultations', href: '/consultations' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Rx Products', href: '/rx-products' },
    { name: 'DermaPoints Loyalty', href: '/loyalty' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Clinical Studies', href: '/clinical-studies' },
    { name: 'Gift Vouchers', href: '/products?category=gift-vouchers' },
  ],
  aboutUs: [
    { name: 'Our Brands', href: '/brands' },
    { name: 'Our Story', href: '/about' },
    { name: 'Podcast', href: '/podcast' },
    { name: 'Google Reviews', href: 'https://g.page/r/Cdwy2h1lkom5EAo/review' },
    { name: 'Distribution', href: '/wholesale' },
    { name: 'WhatsApp Us', href: 'https://wa.me/27675948841' },
    { name: 'Contact Us', href: '/contact' },
  ],
};

const socialLinks = [
  { name: 'Threads', icon: MessageCircle, href: 'https://www.threads.net/@dermastoresa' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/dermastoresa' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/dermastoresa' },
  { name: 'Spotify', icon: Music, href: 'https://open.spotify.com/show/1V1AMjPDAVLoKrESetBgft' },
  { name: 'Apple Podcasts', icon: Headphones, href: 'https://podcasts.apple.com/za/podcast/the-dermastore-podcast/id1604396474' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Shop By Top Range */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Shop By Top Range
            </h4>
            <ul className="space-y-2">
              {footerLinks.shopByTopRange.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Experience */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Customer Experience
            </h4>
            <ul className="space-y-2">
              {footerLinks.customerExperience.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              About Us
            </h4>
            <ul className="space-y-2">
              {footerLinks.aboutUs.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Info & Social */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-gray-900">
                Dermastore
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Specialist online skincare store backed by a leading Dermatologist.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>

            {/* WhatsApp */}
            <div className="mt-6">
              <a
                href="https://wa.me/27675948841"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container-custom flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-sm text-gray-500">
            © Dermastore® {currentYear} All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
