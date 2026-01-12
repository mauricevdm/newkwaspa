import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-heading text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 font-heading text-2xl font-bold">Page Not Found</h2>
        <p className="mt-3 max-w-md text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
          have been moved or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </div>
        <div className="mt-8">
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Go back to previous page
          </Link>
        </div>
      </div>
    </div>
  );
}
