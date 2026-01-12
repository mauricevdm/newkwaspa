'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const promoItems = [
  { text: 'Free delivery on all orders over R750', href: '/shipping', cta: 'Click Here' },
  { text: 'Chat with qualified skin therapists', href: '/consultations', cta: 'Click Here' },
  { text: 'Free samples with every order', href: '/samples', cta: 'Click Here' },
  { text: 'Explore free gifts & promotions', href: '/promotions', cta: 'Click Here' },
];

// Double the items for seamless loop
const duplicatedItems = [...promoItems, ...promoItems, ...promoItems];

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="relative flex h-9 items-center">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -33.33 * promoItems.length + '%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {duplicatedItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group mx-8 flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            >
              <span>{item.text}</span>
              <span className="font-medium underline underline-offset-2">
                {item.cta}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
