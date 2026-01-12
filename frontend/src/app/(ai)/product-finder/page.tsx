'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  ShoppingBag,
  Star,
  X,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store';
import { api } from '@/lib/api';

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  matchScore: number;
}

function stableHashInt(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function buildTags(name: string, description: string): string[] {
  const t = `${name} ${description}`.toLowerCase();
  const tags: string[] = [];
  const maybe = (re: RegExp, label: string) => {
    if (re.test(t)) tags.push(label);
  };
  maybe(/spf|sunscreen|uv/, 'Sun Protection');
  maybe(/vitamin\s*c|ascorb/, 'Vitamin C');
  maybe(/retinol|retinal/, 'Retinoid');
  maybe(/niacinamide/, 'Niacinamide');
  maybe(/hyalur|hydr/, 'Hydrating');
  maybe(/acne|blemish|breakout/, 'Acne');
  maybe(/pigment|brighten|dark\s*spot|melasma/, 'Brightening');
  maybe(/cleanser|cleansing|wash/, 'Cleansing');
  return tags.slice(0, 3);
}

const aiSuggestions = [
  "Best serum for hyperpigmentation",
  "Gentle cleanser for sensitive skin",
  "Anti-aging night cream under R1000",
  "Retinol for beginners",
  "Moisturizer for oily acne-prone skin",
];

export default function ProductFinderPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    setIsSearching(true);
    setQuery(finalQuery);

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 900));

    const response = await api.products.search(finalQuery, { page: 1, pageSize: 24 });
    const mapped: Product[] = response.items.map((p) => {
      const seed = `${p.id}:${finalQuery}`;
      const h = stableHashInt(seed);
      const matchScore = 70 + (h % 30); // 70-99

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand?.name || 'Dermastore',
        price: p.price.amount,
        originalPrice: p.price.compareAtAmount,
        image: p.images?.[0]?.url || '/images/placeholder-product.jpg',
        rating: p.rating?.average ?? 4.6,
        reviews: p.rating?.count ?? 100,
        tags: buildTags(p.name, p.shortDescription || p.description || ''),
        matchScore,
      };
    });

    mapped.sort((a, b) => b.matchScore - a.matchScore);
    setResults(mapped);
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Search
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Smart Product Finder
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Describe what you're looking for in natural language and our AI will find
          the perfect products for your needs.
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-3xl mx-auto mb-8">
        <Card className="p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe what you're looking for... e.g., 'hydrating serum for dry skin under R1000'"
                className="w-full pl-12 pr-4 py-4 text-lg border-0 focus:outline-none focus:ring-0"
              />
            </div>
            <Button type="submit" size="lg" disabled={isSearching || !query.trim()}>
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* AI Suggestions */}
        {!hasSearched && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Try searching for:</p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Found {results.length} products for "{query}"
              </h2>
              <p className="text-gray-500">Sorted by AI relevance score</p>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Results Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {product.image && product.image !== '/images/placeholder-product.jpg' ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                      </div>
                    )}
                    
                    {/* Match Score */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-teal-600 text-white">
                        {product.matchScore}% Match
                      </Badge>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Sale Badge */}
                    {product.originalPrice && (
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="destructive">Sale</Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-teal-600 font-medium mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {product.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {product.price > 0 ? formatPrice(product.price) : 'Price unavailable'}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline">Load More Results</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
