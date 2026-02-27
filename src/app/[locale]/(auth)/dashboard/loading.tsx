export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-20 p-8">
            {/* Header Skeleton */}
            <div className="w-full h-32 rounded-[2.5rem] bg-muted/50 animate-pulse border border-border"></div>

            {/* Metrics Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full h-32 rounded-[2rem] bg-muted/50 animate-pulse border border-border"></div>
                ))}
            </div>

            {/* Main Body Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 w-full h-80 rounded-[2.5rem] bg-muted/50 animate-pulse border border-border"></div>
                <div className="w-full h-80 rounded-[2.5rem] bg-muted/50 animate-pulse border border-border"></div>
            </div>
        </div>
    );
}
