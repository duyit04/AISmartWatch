export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-[var(--bg-secondary)]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text skeleton */}
          <div className="flex-1 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
            <div className="pt-4">
              <Skeleton className="h-14 w-48" variant="rectangular" />
            </div>
            {/* Stats */}
            <div className="flex gap-8 pt-6">
              <div className="space-y-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
          
          {/* Image skeleton */}
          <div className="flex-1 flex items-center justify-center">
            <Skeleton className="w-80 h-80 rounded-3xl" variant="rectangular" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function FeaturesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <FeatureCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SpecsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]"
        >
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-8 md:p-12 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)]">
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-5 h-5 rounded" variant="circular" />
          ))}
        </div>
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-4/5 mb-6" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" variant="circular" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)]">
      <Skeleton className="h-48" />
      <div className="p-5">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
