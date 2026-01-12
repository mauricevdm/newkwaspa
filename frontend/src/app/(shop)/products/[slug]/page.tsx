import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetails } from './product-details';
import { getApiProvider } from '@/lib/api';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Fetch product from API
async function getProduct(slug: string) {
  const api = getApiProvider();
  const product = await api.products.getBySlug(slug);
  
  if (!product) return null;

  // Get attributes helper
  const getAttr = (code: string) => product.attributes?.find(a => a.code === code)?.value;

  // Transform to the format expected by ProductDetails
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name || 'Dermastore',
    price: product.price.amount,
    originalPrice: product.price.compareAtAmount,
    description: product.shortDescription || product.description.substring(0, 200),
    longDescription: product.description,
    images: product.images.map((img: { url: string }) => img.url),
    rating: product.rating?.average || 0,
    reviewCount: product.rating?.count || 0,
    inStock: product.stock?.inStock ?? true,
    sku: product.sku,
    size: getAttr('size') || '',
    skinType: getAttr('skinType')?.split(',') || [],
    concerns: product.categories.map((c: { name: string }) => c.name),
    ingredients: getAttr('ingredients') || '',
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | ${product.brand}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
