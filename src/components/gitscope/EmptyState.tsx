import { Search } from "lucide-react";

interface EmptyStateProps {
  type: "initial" | "not-found" | "rate-limit";
  username?: string;
  resetTime?: number;
  remaining?: number;
  onRetry?: () => void;
}

const EmptyState = ({ type, username, resetTime, remaining, onRetry }: EmptyStateProps) => {
  if (type === "initial") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
          <Search className="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Search a GitHub profile</h2>
        <p className="text-muted-foreground max-w-sm">
          Enter a username above to explore their profile, repositories, and analytics.
        </p>
      </div>
    );
  }

  if (type === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">User not found</h2>
        <p className="text-muted-foreground max-w-sm">
          No GitHub user found with username "<span className="font-mono text-primary">{username}</span>".
        </p>
      </div>
    );
  }

  if (type === "rate-limit") {
    const resetDate = resetTime ? new Date(resetTime * 1000) : null;
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Rate limit reached</h2>
        <p className="text-muted-foreground max-w-sm mb-1">
          GitHub API rate limit exceeded. Try again later.
        </p>
        {resetDate && (
          <p className="text-sm text-muted-foreground font-mono">
            Resets at {resetDate.toLocaleTimeString()}
          </p>
        )}
        {remaining !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            {remaining} requests remaining
          </p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-surface-hover transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default EmptyState;
