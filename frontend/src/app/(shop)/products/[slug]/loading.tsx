import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container-custom py-8">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-10 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-24 rounded-full" />
            ))}
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
