import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Routine Builder | Dermastore',
  description: 'Build your perfect skincare routine with our AI-powered recommendation system.',
};

export default function RoutineBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
