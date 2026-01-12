import { Skeleton } from '@/components/ui/skeleton';

export function ProductsLoading() {
  return (
    <div className="flex gap-8">
      {/* Sidebar Skeleton */}
      <aside className="hidden w-64 shrink-0 space-y-6 lg:block">
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-product rounded-lg" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return <ProductsLoading />;
}
