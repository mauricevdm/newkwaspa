import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col">
      {/* Hero Skeleton */}
      <div className="relative h-[500px] w-full">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Features Bar Skeleton */}
      <div className="border-b bg-secondary/30 py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid Skeleton */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto mt-3 h-4 w-64" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="bg-secondary/30 py-16">
        <div className="container-custom">
          <div className="mb-10">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-3 h-4 w-64" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-product rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
