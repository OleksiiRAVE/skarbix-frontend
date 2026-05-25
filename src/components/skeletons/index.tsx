import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-5 w-96" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[var(--sk-card)] rounded-[20px] p-6 space-y-4 ${className}`}>
      <div className="flex justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-5" />
      </div>
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

export function ChartSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[var(--sk-card)] rounded-[20px] p-6 space-y-4 ${className}`}>
      <div className="flex justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-[var(--sk-border-light)] last:border-0">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 pb-3 border-b">
        <Skeleton className="h-4 w-24 flex-1" />
        <Skeleton className="h-4 w-24 flex-1" />
        <Skeleton className="h-4 w-24 flex-1" />
        <Skeleton className="h-4 w-24 flex-1" />
        <Skeleton className="h-4 w-24 flex-1" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-24 flex-1" />
          <Skeleton className="h-4 w-24 flex-1" />
        </div>
      ))}
    </div>
  );
}
