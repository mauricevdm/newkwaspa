'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Cleansers',
    image: '/images/categories/cleansers.jpg',
    href: '/products?category=cleansers',
    productCount: 45,
  },
  {
    id: 2,
    name: 'Moisturizers',
    image: '/images/categories/moisturizers.jpg',
    href: '/products?category=moisturizers',
    productCount: 62,
  },
  {
    id: 3,
    name: 'Serums',
    image: '/images/categories/serums.jpg',
    href: '/products?category=serums',
    productCount: 38,
  },
  {
    id: 4,
    name: 'Sunscreens',
    image: '/images/categories/sunscreens.jpg',
    href: '/products?category=sunscreens',
    productCount: 28,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function CategoryGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={itemVariants}>
          <Link
            href={category.href}
            className="group relative block aspect-square overflow-hidden rounded-lg bg-secondary"
          >
            {/* Placeholder background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
              <h3 className="font-heading text-xl font-bold md:text-2xl">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-white/80">
                {category.productCount} products
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
