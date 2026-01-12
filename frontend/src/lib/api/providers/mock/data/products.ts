/**
 * Mock Products Data
 * Realistic South African skincare products from actual Dermastore brands
 */

import type { Product } from '../../../types';

export const mockProducts: Product[] = [
  // SkinCeuticals
  {
    id: 'prod-001',
    sku: 'SC-CE-FERULIC-30',
    slug: 'skinceuticals-ce-ferulic',
    name: 'SkinCeuticals C E Ferulic',
    description: 'A daytime antioxidant serum that delivers advanced environmental protection and improves the appearance of fine lines and wrinkles, loss of firmness, and brightens skin complexion.',
    shortDescription: 'Advanced antioxidant serum with vitamin C, E, and ferulic acid.',
    price: {
      amount: 3295,
      currency: 'ZAR',
      formatted: 'R3,295.00',
    },
    images: [
      { id: 'img-001', url: '/images/products/skinceuticals-ce-ferulic.jpg', alt: 'SkinCeuticals C E Ferulic', isDefault: true },
    ],
    brand: { id: 'brand-001', slug: 'skinceuticals', name: 'SkinCeuticals' },
    categories: [
      { id: 'cat-001', slug: 'serums', name: 'Serums', level: 1, path: ['serums'] },
      { id: 'cat-002', slug: 'antioxidants', name: 'Antioxidants', level: 1, path: ['antioxidants'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Aging, Dullness' },
    ],
    stock: { inStock: true, quantity: 25 },
    rating: { average: 4.9, count: 156 },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'prod-002',
    sku: 'SC-HYDRATING-B5',
    slug: 'skinceuticals-hydrating-b5-gel',
    name: 'SkinCeuticals Hydrating B5 Gel',
    description: 'A moisture-enhancing gel that replenishes nutrients the skin needs to feel smooth and appear younger. Contains vitamin B5 and hyaluronic acid.',
    shortDescription: 'Hydrating serum with hyaluronic acid and vitamin B5.',
    price: {
      amount: 1595,
      currency: 'ZAR',
      formatted: 'R1,595.00',
    },
    images: [
      { id: 'img-002', url: '/images/products/skinceuticals-hydrating-b5.jpg', alt: 'SkinCeuticals Hydrating B5 Gel', isDefault: true },
    ],
    brand: { id: 'brand-001', slug: 'skinceuticals', name: 'SkinCeuticals' },
    categories: [
      { id: 'cat-001', slug: 'serums', name: 'Serums', level: 1, path: ['serums'] },
      { id: 'cat-003', slug: 'hydration', name: 'Hydration', level: 1, path: ['hydration'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Dryness, Dehydration' },
    ],
    stock: { inStock: true, quantity: 42 },
    rating: { average: 4.7, count: 89 },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },

  // Lamelle
  {
    id: 'prod-003',
    sku: 'LAM-CLARITY-ACTIVE',
    slug: 'lamelle-clarity-active-control',
    name: 'Lamelle Clarity Active Control',
    description: 'An advanced treatment cream for acne-prone skin. Contains niacinamide, salicylic acid, and zinc to control oil and reduce breakouts.',
    shortDescription: 'Acne treatment cream with niacinamide and salicylic acid.',
    price: {
      amount: 695,
      currency: 'ZAR',
      formatted: 'R695.00',
    },
    images: [
      { id: 'img-003', url: '/images/products/lamelle-clarity-active.jpg', alt: 'Lamelle Clarity Active Control', isDefault: true },
    ],
    brand: { id: 'brand-002', slug: 'lamelle', name: 'Lamelle' },
    categories: [
      { id: 'cat-004', slug: 'treatments', name: 'Treatments', level: 1, path: ['treatments'] },
      { id: 'cat-005', slug: 'acne', name: 'Acne', level: 1, path: ['acne'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'Oily, Acne-Prone' },
      { name: 'Concern', code: 'concern', value: 'Acne, Oil Control' },
    ],
    stock: { inStock: true, quantity: 38 },
    rating: { average: 4.6, count: 203 },
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2025-01-09T00:00:00Z',
  },
  {
    id: 'prod-004',
    sku: 'LAM-NOURISH-REV',
    slug: 'lamelle-nourish-revitalise',
    name: 'Lamelle Nourish Revitalise',
    description: 'A rich, nourishing cream for dry and mature skin. Contains peptides, ceramides, and vitamin E to restore skin barrier function.',
    shortDescription: 'Nourishing cream for dry and mature skin.',
    price: {
      amount: 895,
      currency: 'ZAR',
      formatted: 'R895.00',
    },
    images: [
      { id: 'img-004', url: '/images/products/lamelle-nourish-revitalise.jpg', alt: 'Lamelle Nourish Revitalise', isDefault: true },
    ],
    brand: { id: 'brand-002', slug: 'lamelle', name: 'Lamelle' },
    categories: [
      { id: 'cat-006', slug: 'moisturisers', name: 'Moisturisers', level: 1, path: ['moisturisers'] },
      { id: 'cat-007', slug: 'anti-aging', name: 'Anti-Aging', level: 1, path: ['anti-aging'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '50ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'Dry, Mature' },
      { name: 'Concern', code: 'concern', value: 'Dryness, Aging' },
    ],
    stock: { inStock: true, quantity: 29 },
    rating: { average: 4.8, count: 67 },
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2025-01-07T00:00:00Z',
  },

  // La Roche-Posay
  {
    id: 'prod-005',
    sku: 'LRP-ANTHELIOS-50',
    slug: 'la-roche-posay-anthelios-uvmune-400',
    name: 'La Roche-Posay Anthelios UVMune 400 SPF50+',
    description: 'Innovative sun protection with Mexoryl 400, the first filter to protect against ultra-long UVA rays. Invisible fluid texture.',
    shortDescription: 'Advanced SPF50+ sunscreen with UVA/UVB protection.',
    price: {
      amount: 495,
      currency: 'ZAR',
      formatted: 'R495.00',
    },
    images: [
      { id: 'img-005', url: '/images/products/lrp-anthelios-uvmune.jpg', alt: 'La Roche-Posay Anthelios UVMune 400', isDefault: true },
    ],
    brand: { id: 'brand-003', slug: 'la-roche-posay', name: 'La Roche-Posay' },
    categories: [
      { id: 'cat-008', slug: 'sunscreen', name: 'Sunscreen', level: 1, path: ['sunscreen'] },
      { id: 'cat-009', slug: 'sun-protection', name: 'Sun Protection', level: 1, path: ['sun-protection'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '50ml' },
      { name: 'SPF', code: 'spf', value: '50+' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
    ],
    stock: { inStock: true, quantity: 85 },
    rating: { average: 4.8, count: 312 },
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'prod-006',
    sku: 'LRP-EFFACLAR-DUO',
    slug: 'la-roche-posay-effaclar-duo-plus',
    name: 'La Roche-Posay Effaclar Duo (+)',
    description: 'Global action acne treatment that targets blemishes, marks, and uneven skin texture. With niacinamide and piroctone olamine.',
    shortDescription: 'Acne treatment for blemishes and marks.',
    price: {
      amount: 425,
      currency: 'ZAR',
      formatted: 'R425.00',
    },
    images: [
      { id: 'img-006', url: '/images/products/lrp-effaclar-duo.jpg', alt: 'La Roche-Posay Effaclar Duo (+)', isDefault: true },
    ],
    brand: { id: 'brand-003', slug: 'la-roche-posay', name: 'La Roche-Posay' },
    categories: [
      { id: 'cat-004', slug: 'treatments', name: 'Treatments', level: 1, path: ['treatments'] },
      { id: 'cat-005', slug: 'acne', name: 'Acne', level: 1, path: ['acne'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '40ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'Oily, Acne-Prone' },
      { name: 'Concern', code: 'concern', value: 'Acne, Blemishes' },
    ],
    stock: { inStock: true, quantity: 56 },
    rating: { average: 4.5, count: 189 },
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z',
  },

  // dermalogica
  {
    id: 'prod-007',
    sku: 'DL-PRECLEANSE',
    slug: 'dermalogica-precleanse',
    name: 'dermalogica PreCleanse',
    description: 'An oil cleanser that dissolves makeup, sunscreen, and impurities effectively. The first step in double cleansing.',
    shortDescription: 'Oil cleanser for effective makeup removal.',
    price: {
      amount: 1000,
      currency: 'ZAR',
      formatted: 'R1,000.00',
    },
    images: [
      { id: 'img-007', url: '/images/products/dermalogica-precleanse.jpg', alt: 'dermalogica PreCleanse', isDefault: true },
    ],
    brand: { id: 'brand-004', slug: 'dermalogica', name: 'dermalogica' },
    categories: [
      { id: 'cat-010', slug: 'cleansers', name: 'Cleansers', level: 1, path: ['cleansers'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '150ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Makeup Removal' },
    ],
    stock: { inStock: true, quantity: 44 },
    rating: { average: 4.7, count: 276 },
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },
  {
    id: 'prod-008',
    sku: 'DL-DAILY-MICRO',
    slug: 'dermalogica-daily-microfoliant',
    name: 'dermalogica Daily Microfoliant',
    description: 'A rice-based enzyme powder that activates upon contact with water. Exfoliates, brightens, and smooths skin texture.',
    shortDescription: 'Enzyme powder exfoliant for brighter skin.',
    price: {
      amount: 1350,
      currency: 'ZAR',
      formatted: 'R1,350.00',
    },
    images: [
      { id: 'img-008', url: '/images/products/dermalogica-microfoliant.jpg', alt: 'dermalogica Daily Microfoliant', isDefault: true },
    ],
    brand: { id: 'brand-004', slug: 'dermalogica', name: 'dermalogica' },
    categories: [
      { id: 'cat-011', slug: 'exfoliators', name: 'Exfoliators', level: 1, path: ['exfoliators'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '74g' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Dullness, Texture' },
    ],
    stock: { inStock: true, quantity: 31 },
    rating: { average: 4.9, count: 412 },
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2025-01-09T00:00:00Z',
  },

  // NeoStrata
  {
    id: 'prod-009',
    sku: 'NEO-GLYCOLIC-REN',
    slug: 'neostrata-glycolic-renewal-smoothing-cream',
    name: 'NeoStrata Glycolic Renewal Smoothing Cream',
    description: 'A powerful antiaging cream with 10% glycolic acid. Reduces wrinkles, improves texture, and brightens skin tone.',
    shortDescription: '10% glycolic acid antiaging cream.',
    price: {
      amount: 850,
      currency: 'ZAR',
      formatted: 'R850.00',
    },
    images: [
      { id: 'img-009', url: '/images/products/neostrata-glycolic-cream.jpg', alt: 'NeoStrata Glycolic Renewal Cream', isDefault: true },
    ],
    brand: { id: 'brand-005', slug: 'neostrata', name: 'NeoStrata' },
    categories: [
      { id: 'cat-006', slug: 'moisturisers', name: 'Moisturisers', level: 1, path: ['moisturisers'] },
      { id: 'cat-007', slug: 'anti-aging', name: 'Anti-Aging', level: 1, path: ['anti-aging'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '40g' },
      { name: 'Active', code: 'active', value: '10% Glycolic Acid' },
      { name: 'Skin Type', code: 'skin_type', value: 'Normal, Oily' },
    ],
    stock: { inStock: true, quantity: 22 },
    rating: { average: 4.6, count: 98 },
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },
  {
    id: 'prod-010',
    sku: 'NEO-BIONIC-FACE',
    slug: 'neostrata-bionic-face-cream',
    name: 'NeoStrata Bionic Face Cream',
    description: 'A gentle yet effective cream with lactobionic acid. Hydrates, strengthens skin barrier, and reduces signs of aging.',
    shortDescription: 'Gentle antiaging cream with bionic acids.',
    price: {
      amount: 795,
      currency: 'ZAR',
      formatted: 'R795.00',
    },
    images: [
      { id: 'img-010', url: '/images/products/neostrata-bionic-cream.jpg', alt: 'NeoStrata Bionic Face Cream', isDefault: true },
    ],
    brand: { id: 'brand-005', slug: 'neostrata', name: 'NeoStrata' },
    categories: [
      { id: 'cat-006', slug: 'moisturisers', name: 'Moisturisers', level: 1, path: ['moisturisers'] },
      { id: 'cat-003', slug: 'hydration', name: 'Hydration', level: 1, path: ['hydration'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '40g' },
      { name: 'Active', code: 'active', value: 'Lactobionic Acid' },
      { name: 'Skin Type', code: 'skin_type', value: 'Sensitive, Dry' },
    ],
    stock: { inStock: true, quantity: 18 },
    rating: { average: 4.7, count: 76 },
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z',
  },

  // pHformula
  {
    id: 'prod-011',
    sku: 'PHF-MELA-ACTIVE',
    slug: 'phformula-mela-active',
    name: 'pHformula M.E.L.A. Active',
    description: 'A targeted treatment for hyperpigmentation and uneven skin tone. Contains arbutin, kojic acid, and vitamin C.',
    shortDescription: 'Pigmentation treatment with arbutin and kojic acid.',
    price: {
      amount: 1150,
      currency: 'ZAR',
      formatted: 'R1,150.00',
    },
    images: [
      { id: 'img-011', url: '/images/products/phformula-mela-active.jpg', alt: 'pHformula M.E.L.A. Active', isDefault: true },
    ],
    brand: { id: 'brand-006', slug: 'phformula', name: 'pHformula' },
    categories: [
      { id: 'cat-004', slug: 'treatments', name: 'Treatments', level: 1, path: ['treatments'] },
      { id: 'cat-012', slug: 'pigmentation', name: 'Pigmentation', level: 1, path: ['pigmentation'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Pigmentation, Dark Spots' },
    ],
    stock: { inStock: true, quantity: 27 },
    rating: { average: 4.5, count: 134 },
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2025-01-07T00:00:00Z',
  },
  {
    id: 'prod-012',
    sku: 'PHF-POST-RECOVERY',
    slug: 'phformula-post-recovery-cream',
    name: 'pHformula POST Recovery Cream 100ml',
    description: 'A rich cream that helps hydrate, soothe, and restore post-treatment skin. Essential for peel aftercare.',
    shortDescription: 'Post-treatment recovery cream.',
    price: {
      amount: 1305,
      currency: 'ZAR',
      formatted: 'R1,305.00',
    },
    images: [
      { id: 'img-012', url: '/images/products/phformula-post-recovery.jpg', alt: 'pHformula POST Recovery Cream', isDefault: true },
    ],
    brand: { id: 'brand-006', slug: 'phformula', name: 'pHformula' },
    categories: [
      { id: 'cat-006', slug: 'moisturisers', name: 'Moisturisers', level: 1, path: ['moisturisers'] },
      { id: 'cat-013', slug: 'post-treatment', name: 'Post-Treatment', level: 1, path: ['post-treatment'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '100ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Recovery, Sensitivity' },
    ],
    stock: { inStock: true, quantity: 33 },
    rating: { average: 4.8, count: 91 },
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z',
  },

  // Kiehl's
  {
    id: 'prod-013',
    sku: 'KHL-MIDNIGHT-REC',
    slug: 'kiehls-midnight-recovery-concentrate',
    name: "Kiehl's Midnight Recovery Concentrate",
    description: 'A nighttime facial oil that replenishes and restores skin. Contains lavender essential oil and evening primrose oil.',
    shortDescription: 'Nighttime facial oil for skin restoration.',
    price: {
      amount: 1250,
      currency: 'ZAR',
      formatted: 'R1,250.00',
    },
    images: [
      { id: 'img-013', url: '/images/products/kiehls-midnight-recovery.jpg', alt: "Kiehl's Midnight Recovery Concentrate", isDefault: true },
    ],
    brand: { id: 'brand-007', slug: 'kiehls', name: "Kiehl's" },
    categories: [
      { id: 'cat-001', slug: 'serums', name: 'Serums', level: 1, path: ['serums'] },
      { id: 'cat-014', slug: 'night-care', name: 'Night Care', level: 1, path: ['night-care'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Dullness, Fatigue' },
    ],
    stock: { inStock: true, quantity: 19 },
    rating: { average: 4.7, count: 187 },
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },
  {
    id: 'prod-014',
    sku: 'KHL-CREME-CORPS',
    slug: 'kiehls-creme-de-corps',
    name: "Kiehl's Creme De Corps 500ml",
    description: 'An indulgent body lotion to soften, smooth, and hydrate dry skin. With cocoa butter and beta-carotene.',
    shortDescription: 'Rich body lotion for dry skin.',
    price: {
      amount: 1370,
      currency: 'ZAR',
      formatted: 'R1,370.00',
    },
    images: [
      { id: 'img-014', url: '/images/products/kiehls-creme-de-corps.jpg', alt: "Kiehl's Creme De Corps", isDefault: true },
    ],
    brand: { id: 'brand-007', slug: 'kiehls', name: "Kiehl's" },
    categories: [
      { id: 'cat-015', slug: 'body-care', name: 'Body Care', level: 1, path: ['body-care'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '500ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'Dry' },
      { name: 'Concern', code: 'concern', value: 'Dryness' },
    ],
    stock: { inStock: true, quantity: 24 },
    rating: { average: 4.9, count: 234 },
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },

  // MartiDerm
  {
    id: 'prod-015',
    sku: 'MD-PHOTO-AGE-HA',
    slug: 'martiderm-photo-age-ha-plus',
    name: 'MartiDerm Photo-Age HA+',
    description: 'Ampoules with pure vitamin C and hyaluronic acid. Provides antioxidant protection and deep hydration.',
    shortDescription: 'Vitamin C ampoules with hyaluronic acid.',
    price: {
      amount: 895,
      currency: 'ZAR',
      formatted: 'R895.00',
    },
    images: [
      { id: 'img-015', url: '/images/products/martiderm-photo-age-ha.jpg', alt: 'MartiDerm Photo-Age HA+', isDefault: true },
    ],
    brand: { id: 'brand-008', slug: 'martiderm', name: 'MartiDerm' },
    categories: [
      { id: 'cat-001', slug: 'serums', name: 'Serums', level: 1, path: ['serums'] },
      { id: 'cat-002', slug: 'antioxidants', name: 'Antioxidants', level: 1, path: ['antioxidants'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '10 x 2ml' },
      { name: 'Active', code: 'active', value: 'Vitamin C, Hyaluronic Acid' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
    ],
    stock: { inStock: true, quantity: 41 },
    rating: { average: 4.6, count: 112 },
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-01-09T00:00:00Z',
  },

  // Mesoestetic
  {
    id: 'prod-016',
    sku: 'MESO-COSMELAN-2',
    slug: 'mesoestetic-cosmelan-2',
    name: 'Mesoestetic Cosmelan 2',
    description: 'Home maintenance cream for the Cosmelan depigmentation treatment. Helps maintain results and prevent pigmentation recurrence.',
    shortDescription: 'Depigmentation maintenance cream.',
    price: {
      amount: 2450,
      currency: 'ZAR',
      formatted: 'R2,450.00',
    },
    images: [
      { id: 'img-016', url: '/images/products/mesoestetic-cosmelan-2.jpg', alt: 'Mesoestetic Cosmelan 2', isDefault: true },
    ],
    brand: { id: 'brand-009', slug: 'mesoestetic', name: 'Mesoestetic' },
    categories: [
      { id: 'cat-004', slug: 'treatments', name: 'Treatments', level: 1, path: ['treatments'] },
      { id: 'cat-012', slug: 'pigmentation', name: 'Pigmentation', level: 1, path: ['pigmentation'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Melasma, Pigmentation' },
    ],
    stock: { inStock: true, quantity: 15 },
    rating: { average: 4.8, count: 156 },
    createdAt: '2024-07-15T00:00:00Z',
    updatedAt: '2025-01-07T00:00:00Z',
  },

  // Huxley
  {
    id: 'prod-017',
    sku: 'HUX-ESSENCE-GRAB',
    slug: 'huxley-secret-of-sahara-essence-grab-water',
    name: 'Huxley Secret of Sahara Essence Grab Water',
    description: 'A lightweight essence that delivers instant hydration. Contains prickly pear seed oil from the Sahara desert.',
    shortDescription: 'Hydrating essence with prickly pear oil.',
    price: {
      amount: 650,
      currency: 'ZAR',
      formatted: 'R650.00',
    },
    images: [
      { id: 'img-017', url: '/images/products/huxley-essence-grab-water.jpg', alt: 'Huxley Essence Grab Water', isDefault: true },
    ],
    brand: { id: 'brand-010', slug: 'huxley', name: 'Huxley' },
    categories: [
      { id: 'cat-001', slug: 'serums', name: 'Serums', level: 1, path: ['serums'] },
      { id: 'cat-003', slug: 'hydration', name: 'Hydration', level: 1, path: ['hydration'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Dehydration' },
    ],
    stock: { inStock: true, quantity: 36 },
    rating: { average: 4.5, count: 89 },
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z',
  },

  // Melumé
  {
    id: 'prod-018',
    sku: 'MEL-PIGMENT-CTRL',
    slug: 'melume-pigment-control-complex',
    name: 'Melumé Pigment Control Complex',
    description: 'A powerful serum that targets stubborn pigmentation and uneven skin tone. South African formulation.',
    shortDescription: 'Pigmentation control serum.',
    price: {
      amount: 950,
      currency: 'ZAR',
      formatted: 'R950.00',
    },
    images: [
      { id: 'img-018', url: '/images/products/melume-pigment-control.jpg', alt: 'Melumé Pigment Control Complex', isDefault: true },
    ],
    brand: { id: 'brand-011', slug: 'melume', name: 'Melumé Skinscience' },
    categories: [
      { id: 'cat-001', slug: 'serums', name: 'Serums', level: 1, path: ['serums'] },
      { id: 'cat-012', slug: 'pigmentation', name: 'Pigmentation', level: 1, path: ['pigmentation'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '30ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Pigmentation, Dark Spots' },
    ],
    stock: { inStock: true, quantity: 28 },
    rating: { average: 4.6, count: 67 },
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },

  // Jorgobé
  {
    id: 'prod-019',
    sku: 'JOR-PEEL-OFF-BLK',
    slug: 'jorgobe-black-peel-off-mask',
    name: 'Jorgobé The Original Black Peel Off Mask',
    description: 'A deep cleansing peel-off mask that removes blackheads and impurities. Reveals cleaner, smoother skin.',
    shortDescription: 'Deep cleansing peel-off mask.',
    price: {
      amount: 285,
      currency: 'ZAR',
      formatted: 'R285.00',
    },
    images: [
      { id: 'img-019', url: '/images/products/jorgobe-black-peel-off.jpg', alt: 'Jorgobé Black Peel Off Mask', isDefault: true },
    ],
    brand: { id: 'brand-012', slug: 'jorgobe', name: 'Jorgobé' },
    categories: [
      { id: 'cat-016', slug: 'masks', name: 'Masks', level: 1, path: ['masks'] },
      { id: 'cat-010', slug: 'cleansers', name: 'Cleansers', level: 1, path: ['cleansers'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '100ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'Normal, Oily' },
      { name: 'Concern', code: 'concern', value: 'Blackheads, Pores' },
    ],
    stock: { inStock: true, quantity: 52 },
    rating: { average: 4.3, count: 201 },
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },

  // More variety - Body care
  {
    id: 'prod-020',
    sku: 'BAR-BHA-BODY',
    slug: 'baren-sencicative-bha-body-wash',
    name: 'Baren SenCICAtive BHA Body Wash',
    description: 'An exfoliating body wash that helps clear breakouts on the back, chest, or shoulders. Contains BHA and centella.',
    shortDescription: 'BHA body wash for body acne.',
    price: {
      amount: 450,
      currency: 'ZAR',
      formatted: 'R450.00',
    },
    images: [
      { id: 'img-020', url: '/images/products/baren-bha-body-wash.jpg', alt: 'Baren BHA Body Wash', isDefault: true },
    ],
    brand: { id: 'brand-013', slug: 'baren', name: 'Baren' },
    categories: [
      { id: 'cat-015', slug: 'body-care', name: 'Body Care', level: 1, path: ['body-care'] },
      { id: 'cat-005', slug: 'acne', name: 'Acne', level: 1, path: ['acne'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '300ml' },
      { name: 'Active', code: 'active', value: 'BHA, Centella' },
      { name: 'Skin Type', code: 'skin_type', value: 'Oily, Acne-Prone' },
    ],
    stock: { inStock: true, quantity: 39 },
    rating: { average: 4.4, count: 78 },
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2025-01-07T00:00:00Z',
  },

  // Gift sets
  {
    id: 'prod-021',
    sku: 'DL-GLOW-SET',
    slug: 'dermalogica-let-it-glow-set',
    name: 'dermalogica let it glow set',
    description: 'A three-step cleansing routine for smooth, clear, radiant, glowing skin. Perfect gift set.',
    shortDescription: 'Cleansing trio gift set.',
    price: {
      amount: 2550,
      currency: 'ZAR',
      formatted: 'R2,550.00',
    },
    images: [
      { id: 'img-021', url: '/images/products/dermalogica-let-it-glow.jpg', alt: 'dermalogica let it glow set', isDefault: true },
    ],
    brand: { id: 'brand-004', slug: 'dermalogica', name: 'dermalogica' },
    categories: [
      { id: 'cat-017', slug: 'gift-sets', name: 'Gift Sets', level: 1, path: ['gift-sets'] },
    ],
    attributes: [
      { name: 'Contents', code: 'contents', value: 'PreCleanse, Special Cleansing Gel, Daily Microfoliant' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
    ],
    stock: { inStock: true, quantity: 12 },
    rating: { average: 4.8, count: 45 },
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2025-01-09T00:00:00Z',
  },
  {
    id: 'prod-022',
    sku: 'LAM-FESTIVE-SET',
    slug: 'lamelle-festive-radiance-set',
    name: 'Lamelle Festive Radiance Set',
    description: 'A curated set of Lamelle bestsellers for radiant, healthy skin. Limited edition festive packaging.',
    shortDescription: 'Festive skincare gift set.',
    price: {
      amount: 1850,
      currency: 'ZAR',
      formatted: 'R1,850.00',
      compareAtAmount: 2200,
      compareAtFormatted: 'R2,200.00',
    },
    images: [
      { id: 'img-022', url: '/images/products/lamelle-festive-set.jpg', alt: 'Lamelle Festive Radiance Set', isDefault: true },
    ],
    brand: { id: 'brand-002', slug: 'lamelle', name: 'Lamelle' },
    categories: [
      { id: 'cat-017', slug: 'gift-sets', name: 'Gift Sets', level: 1, path: ['gift-sets'] },
    ],
    attributes: [
      { name: 'Contents', code: 'contents', value: 'Serra Cleansing Gel, Corrective C+, Nourish Revitalise' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
    ],
    stock: { inStock: true, quantity: 8 },
    rating: { average: 4.9, count: 32 },
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },

  // Travel sizes
  {
    id: 'prod-023',
    sku: 'PHF-AC-TRAVEL',
    slug: 'phformula-ac-resurfacing-travel-kit',
    name: 'pHformula AC Resurfacing Travel Kit',
    description: 'A travel kit for managing acne, oil control, and skin texture. TSA-friendly sizes.',
    shortDescription: 'Acne travel kit.',
    price: {
      amount: 980,
      currency: 'ZAR',
      formatted: 'R980.00',
    },
    images: [
      { id: 'img-023', url: '/images/products/phformula-ac-travel.jpg', alt: 'pHformula AC Travel Kit', isDefault: true },
    ],
    brand: { id: 'brand-006', slug: 'phformula', name: 'pHformula' },
    categories: [
      { id: 'cat-018', slug: 'travel-sizes', name: 'Travel Sizes', level: 1, path: ['travel-sizes'] },
      { id: 'cat-005', slug: 'acne', name: 'Acne', level: 1, path: ['acne'] },
    ],
    attributes: [
      { name: 'Kit Type', code: 'kit_type', value: 'Travel' },
      { name: 'Skin Type', code: 'skin_type', value: 'Oily, Acne-Prone' },
    ],
    stock: { inStock: true, quantity: 21 },
    rating: { average: 4.5, count: 56 },
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z',
  },

  // Eye care
  {
    id: 'prod-024',
    sku: 'SC-AGE-EYE',
    slug: 'skinceuticals-age-eye-complex',
    name: 'SkinCeuticals A.G.E. Eye Complex',
    description: 'An antiaging eye cream that targets crow\'s feet, dark circles, and puffiness. Contains proxylane and blueberry extract.',
    shortDescription: 'Antiaging eye cream.',
    price: {
      amount: 2150,
      currency: 'ZAR',
      formatted: 'R2,150.00',
    },
    images: [
      { id: 'img-024', url: '/images/products/skinceuticals-age-eye.jpg', alt: 'SkinCeuticals A.G.E. Eye Complex', isDefault: true },
    ],
    brand: { id: 'brand-001', slug: 'skinceuticals', name: 'SkinCeuticals' },
    categories: [
      { id: 'cat-019', slug: 'eye-care', name: 'Eye Care', level: 1, path: ['eye-care'] },
      { id: 'cat-007', slug: 'anti-aging', name: 'Anti-Aging', level: 1, path: ['anti-aging'] },
    ],
    attributes: [
      { name: 'Size', code: 'size', value: '15ml' },
      { name: 'Skin Type', code: 'skin_type', value: 'All Skin Types' },
      { name: 'Concern', code: 'concern', value: 'Wrinkles, Dark Circles, Puffiness' },
    ],
    stock: { inStock: true, quantity: 16 },
    rating: { average: 4.7, count: 89 },
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },

  // Supplements
  {
    id: 'prod-025',
    sku: 'DS-CREATINE',
    slug: 'dermastore-creatine-monohydrate',
    name: 'Dermastore® Creatine Monohydrate 3g x 30',
    description: 'A daily health supplement for better muscle strength, cognitive benefits, and exercise recovery. The purest creatine available.',
    shortDescription: 'Pure creatine supplement.',
    price: {
      amount: 220,
      currency: 'ZAR',
      formatted: 'R220.00',
    },
    images: [
      { id: 'img-025', url: '/images/products/dermastore-creatine.jpg', alt: 'Dermastore Creatine Monohydrate', isDefault: true },
    ],
    brand: { id: 'brand-014', slug: 'dermastore', name: 'Dermastore' },
    categories: [
      { id: 'cat-020', slug: 'supplements', name: 'Supplements', level: 1, path: ['supplements'] },
    ],
    attributes: [
      { name: 'Servings', code: 'servings', value: '30' },
      { name: 'Dose', code: 'dose', value: '3g' },
    ],
    stock: { inStock: true, quantity: 65 },
    rating: { average: 4.6, count: 34 },
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
];

export default mockProducts;
