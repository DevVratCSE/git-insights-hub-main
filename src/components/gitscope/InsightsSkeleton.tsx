const InsightsSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-5 animate-fade-in">
    <div className="h-5 w-28 skeleton-pulse" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-4 w-4 rounded skeleton-pulse" />
          <div className="h-4 flex-1 skeleton-pulse" />
          <div className="h-4 w-8 skeleton-pulse" />
        </div>
      ))}
    </div>
    <div className="h-px bg-border" />
    <div className="space-y-2">
      <div className="h-4 w-32 skeleton-pulse" />
      <div className="h-4 w-48 skeleton-pulse" />
    </div>
    <div className="flex justify-center pt-2">
      <div className="h-24 w-24 rounded-full skeleton-pulse" />
    </div>
  </div>
);

export default InsightsSkeleton;
