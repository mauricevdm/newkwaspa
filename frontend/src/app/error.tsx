'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-error/10 p-4">
            <AlertTriangle className="h-12 w-12 text-error" />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold">Something went wrong!</h1>
        <p className="mt-3 text-muted-foreground">
          We apologize for the inconvenience. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-sm text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
