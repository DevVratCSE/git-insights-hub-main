import { Search, Star, ArrowLeftRight } from "lucide-react";

interface HeaderSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: () => void;
  compareMode: boolean;
  onToggleCompare: () => void;
  onOpenFavorites: () => void;
}

const HeaderSearch = ({
  query,
  onQueryChange,
  onSearch,
  compareMode,
  onToggleCompare,
  onOpenFavorites,
}: HeaderSearchProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground font-mono">G</span>
          </div>
          <span className="text-sm font-semibold text-foreground hidden sm:block tracking-tight">
            GitScope
          </span>
        </div>

        {/* Search */}
        {!compareMode && (
          <div className="flex-1 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search GitHub user…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow font-mono"
            />
          </div>
        )}

        {compareMode && <div className="flex-1" />}

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleCompare}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              compareMode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </button>
          <button
            onClick={onOpenFavorites}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-surface-hover transition-colors"
          >
            <Star className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Favorites</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderSearch;
