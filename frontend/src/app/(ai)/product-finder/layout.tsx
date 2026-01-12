import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Product Finder | Dermastore',
  description: 'Find the perfect skincare products with our AI-powered smart search.',
};

export default function ProductFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
