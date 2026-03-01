export default function DashboardLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-8 pb-20">
      {/* Header Skeleton */}
      <div className="h-32 w-full animate-pulse rounded-[2.5rem] border border-border bg-muted/50"></div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 w-full animate-pulse rounded-[2rem] border border-border bg-muted/50"></div>
        ))}
      </div>

      {/* Main Body Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 w-full animate-pulse rounded-[2.5rem] border border-border bg-muted/50 lg:col-span-2"></div>
        <div className="h-80 w-full animate-pulse rounded-[2.5rem] border border-border bg-muted/50"></div>
      </div>
    </div>
  );
}
