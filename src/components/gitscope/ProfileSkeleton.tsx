const ProfileSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-5 animate-fade-in">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full skeleton-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-32 skeleton-pulse" />
        <div className="h-4 w-24 skeleton-pulse" />
      </div>
    </div>
    <div className="h-4 w-full skeleton-pulse" />
    <div className="h-4 w-3/4 skeleton-pulse" />
    <div className="flex gap-6 pt-2">
      <div className="h-10 w-20 skeleton-pulse" />
      <div className="h-10 w-20 skeleton-pulse" />
      <div className="h-10 w-20 skeleton-pulse" />
    </div>
  </div>
);

export default ProfileSkeleton;
