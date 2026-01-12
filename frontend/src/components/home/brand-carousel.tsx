'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Actual brands from dermastore.co.za
const brands = [
  { id: 1, name: 'SkinCeuticals', logo: '/images/brands/skinceuticals.png', href: '/brands/skinceuticals' },
  { id: 2, name: 'NeoStrata', logo: '/images/brands/neostrata.png', href: '/brands/neostrata' },
  { id: 3, name: 'MartiDerm', logo: '/images/brands/martiderm.png', href: '/brands/martiderm' },
  { id: 4, name: 'Huxley', logo: '/images/brands/huxley.png', href: '/brands/huxley' },
  { id: 5, name: 'Jorgobé', logo: '/images/brands/jorgobe.png', href: '/brands/jorgobe' },
  { id: 6, name: 'Lamelle', logo: '/images/brands/lamelle.png', href: '/brands/lamelle' },
  { id: 7, name: 'pHformula', logo: '/images/brands/phformula.png', href: '/brands/phformula' },
  { id: 8, name: 'Melumé Skinscience', logo: '/images/brands/melume.png', href: '/brands/melume' },
  { id: 9, name: 'Mesoestetic', logo: '/images/brands/mesoestetic.png', href: '/brands/mesoestetic' },
  { id: 10, name: 'dermalogica', logo: '/images/brands/dermalogica.png', href: '/brands/dermalogica' },
  { id: 11, name: "Kiehl's", logo: '/images/brands/kiehls.png', href: '/brands/kiehls' },
  { id: 12, name: 'La Roche-Posay', logo: '/images/brands/la-roche-posay.png', href: '/brands/la-roche-posay' },
];

export function BrandCarousel() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:gap-6">
      {brands.map((brand, index) => (
        <motion.div
          key={brand.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={brand.href}
            className="group flex aspect-[3/2] items-center justify-center rounded-lg border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-sm"
          >
            <span className="text-center text-sm font-medium text-gray-600 transition-colors group-hover:text-gray-900">
              {brand.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
