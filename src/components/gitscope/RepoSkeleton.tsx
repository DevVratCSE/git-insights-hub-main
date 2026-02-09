const RepoSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 skeleton-pulse" />
          <div className="h-4 w-16 skeleton-pulse" />
        </div>
        <div className="h-4 w-full skeleton-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-12 skeleton-pulse" />
          <div className="h-4 w-12 skeleton-pulse" />
          <div className="h-4 w-16 skeleton-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default RepoSkeleton;
