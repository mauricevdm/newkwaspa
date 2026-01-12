/**
 * Generated Mock Products Data
 *
 * Sourced from src/mock-data/all-products.json (captured from real site sitemaps).
 * This adapter maps that lightweight JSON into the unified API Product shape.
 */

import type { Product, Brand, Category, ProductImage, Rating, StockStatus, Price } from '../../../types';
import { mockBrands } from './brands';
import { mockCategories } from './categories';

import allProductsJson from '@/mock-data/all-products.json';

type SitemapProductRecord = {
  source: string;
  url: string;
  name: string | null;
  sku: string;
  imageUrl: string | null;
  images: string[];
  description: string | null;
  price: number | null;
  currency: string | null;
};

type AllProductsJson = {
  generatedAt: string;
  count: number;
  products: SitemapProductRecord[];
};

const DEFAULT_CURRENCY = 'ZAR';

function formatPrice(amount: number): string {
  return `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hostPrefix(sourceUrl: string): string {
  try {
    const host = new URL(sourceUrl).host;
    return slugify(host.replace(/^www\./, ''));
  } catch {
    return 'source';
  }
}

function extractSlugFromProductUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'product';

    // Shopify: /products/<handle>
    if (parts[0] === 'products' && parts[1]) return slugify(parts[1]);

    // Woo/WordPress-style root slug: /<slug>/
    return slugify(parts[parts.length - 1] || 'product');
  } catch {
    return 'product';
  }
}

function stableHashInt(value: string): number {
  // Simple, deterministic 32-bit hash
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function makeRating(seed: string): Rating {
  const n = stableHashInt(seed);
  const average = 4.1 + (n % 90) / 100; // 4.10 - 4.99
  const count = 10 + (n % 490); // 10 - 499
  return { average: Math.round(average * 10) / 10, count };
}

function makeStock(seed: string): StockStatus {
  const n = stableHashInt(seed);
  const inStock = n % 10 !== 0; // ~90% in stock
  const quantity = inStock ? 5 + (n % 80) : 0;
  return { inStock, quantity };
}

function inferCategories(text: string): Category[] {
  const t = text.toLowerCase();
  const rules: Array<{ slug: string; re: RegExp }> = [
    { slug: 'sunscreen', re: /(\bspf\b|sunscreen|sun\s*screen|uv)/i },
    { slug: 'cleansers', re: /(cleanser|cleansing|face\s*wash|wash\b|micellar|foam)/i },
    { slug: 'serums', re: /(serum|ampoule|booster)/i },
    { slug: 'masks', re: /(mask|peel[-\s]*off)/i },
    { slug: 'eye-care', re: /(\beye\b|under[-\s]*eye|undereye)/i },
    { slug: 'exfoliators', re: /(exfol|peel\b|aha\b|bha\b|glycol|lactic|salicylic)/i },
    { slug: 'acne', re: /(acne|blemish|breakout|comed|pimple)/i },
    { slug: 'pigmentation', re: /(pigment|brighten|dark\s*spot|melasma)/i },
    { slug: 'anti-aging', re: /(retinol|wrinkl|anti[-\s]*aging|ageing|firm)/i },
    { slug: 'supplements', re: /(capsule|tablet|supplement|collagen)/i },
    { slug: 'body-care', re: /(\bbody\b|hand\b|foot\b|neck\b)/i },
    { slug: 'moisturisers', re: /(moisturi|cream\b|lotion\b|balm\b|gel[-\s]*cream)/i },
  ];

  for (const rule of rules) {
    if (rule.re.test(t)) {
      const cat = mockCategories.find((c) => c.slug === rule.slug);
      if (cat) return [cat];
    }
  }

  // fallback
  return [mockCategories.find((c) => c.slug === 'treatments') ?? mockCategories[0]];
}

function normalizeCompareString(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

function inferBrand(name: string): Brand {
  const needle = normalizeCompareString(name);

  const matched = mockBrands.find((b) => {
    const bn = normalizeCompareString(b.name);
    return bn && (needle.startsWith(bn) || needle.includes(bn));
  });
  if (matched) return matched;

  // Heuristic: use first 1-2 tokens as a brand-ish name
  const tokens = name.split(/\s+/).filter(Boolean);
  const brandName = tokens.slice(0, tokens[0]?.toLowerCase() === 'la' ? 2 : 1).join(' ') || 'Dermastore';
  const slug = slugify(brandName) || 'dermastore';
  return { id: `brand-${slug}`, slug, name: brandName };
}

function mapToApiProduct(record: SitemapProductRecord, index: number): Product {
  const sourcePrefix = hostPrefix(record.source);
  const baseSlug = extractSlugFromProductUrl(record.url);
  const slug = `${sourcePrefix}-${baseSlug}`;
  const id = `${sourcePrefix}-${record.sku}`;

  const name = record.name ?? baseSlug.replace(/-/g, ' ');
  const description = record.description ?? '';
  const brand = inferBrand(name);

  const categories = inferCategories(`${name} ${description}`);

  const images: ProductImage[] = (record.images?.length ? record.images : record.imageUrl ? [record.imageUrl] : [])
    .filter(Boolean)
    .map((url, i) => ({
      id: `${id}-img-${i + 1}`,
      url,
      alt: name,
      isDefault: i === 0,
    }));

  const amount = record.price ?? 0;
  const currency = record.currency ?? DEFAULT_CURRENCY;
  const price: Price = {
    amount,
    currency,
    formatted: formatPrice(amount),
  };

  const now = Date.now();
  const createdAt = new Date(now - (index % 365) * 24 * 60 * 60 * 1000).toISOString();
  const updatedAt = new Date(now - (index % 60) * 24 * 60 * 60 * 1000).toISOString();

  return {
    id,
    sku: record.sku,
    slug,
    name,
    description,
    shortDescription: description ? description.slice(0, 180) : undefined,
    price,
    images,
    brand,
    categories,
    attributes: [],
    stock: makeStock(id),
    rating: makeRating(id),
    metaTitle: name,
    metaDescription: description ? description.slice(0, 160) : undefined,
    createdAt,
    updatedAt,
  };
}

const dataset = allProductsJson as unknown as AllProductsJson;

export const mockProducts: Product[] = (dataset.products ?? []).map(mapToApiProduct);

export default mockProducts;
