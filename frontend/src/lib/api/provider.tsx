'use client';

/**
 * API Query Provider
 * 
 * Wraps the application with React Query provider for data fetching.
 * Must be used in the root layout.
 * 
 * Usage in layout.tsx:
 * ```tsx
 * import { ApiQueryProvider } from '@/lib/api/provider';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ApiQueryProvider>{children}</ApiQueryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

interface ApiQueryProviderProps {
  children: ReactNode;
}

export function ApiQueryProvider({ children }: ApiQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default stale time of 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 30 minutes
            gcTime: 30 * 60 * 1000,
            // Retry failed requests 3 times
            retry: 3,
            // Refetch on window focus in production
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default ApiQueryProvider;
