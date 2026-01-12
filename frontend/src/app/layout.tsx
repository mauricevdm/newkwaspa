import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dermastore.co.za'),
  title: {
    default: 'Dermastore | Premium Skincare Products South Africa',
    template: '%s | Dermastore',
  },
  description:
    'South Africa\'s leading online destination for premium skincare products. Shop dermatologist-recommended brands with AI-powered skin analysis.',
  keywords: [
    'skincare',
    'beauty',
    'South Africa',
    'dermatologist',
    'skin analysis',
    'premium skincare',
    'anti-aging',
    'moisturizer',
    'serum',
  ],
  authors: [{ name: 'Dermastore' }],
  creator: 'Dermastore',
  publisher: 'Dermastore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://dermastore.co.za',
    siteName: 'Dermastore',
    title: 'Dermastore | Premium Skincare Products South Africa',
    description:
      'South Africa\'s leading online destination for premium skincare products.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dermastore - Premium Skincare',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dermastore | Premium Skincare Products',
    description: 'South Africa\'s leading online destination for premium skincare products.',
    images: ['/images/og-image.jpg'],
    creator: '@dermastore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#008B8B' },
    { media: '(prefers-color-scheme: dark)', color: '#006969' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
