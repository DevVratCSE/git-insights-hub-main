import { useState, useMemo } from "react";
import type { GitHubRepo } from "@/api/github";
import RepoCard from "./RepoCard";
import RepoSkeleton from "./RepoSkeleton";
import { Search, ChevronDown } from "lucide-react";

interface RepoListProps {
  repos: GitHubRepo[];
  loading: boolean;
}

type SortKey = "updated" | "stars" | "forks" | "name";

const RepoList = ({ repos, loading }: RepoListProps) => {
  const [sortBy, setSortBy] = useState<SortKey>("updated");
  const [filterLang, setFilterLang] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => r.language && langs.add(r.language));
    return Array.from(langs).sort();
  }, [repos]);

  const filtered = useMemo(() => {
    let result = [...repos];

    if (filterLang) {
      result = result.filter((r) => r.language === filterLang);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "forks":
          return b.forks_count - a.forks_count;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.pushed_at || b.updated_at).getTime() -
            new Date(a.pushed_at || a.updated_at).getTime();
      }
    });

    return result;
  }, [repos, sortBy, filterLang, searchQuery]);

  if (loading) return <RepoSkeleton />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search repos…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
          />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-secondary border border-border rounded-md text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="updated">Updated</option>
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="name">Name</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {languages.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-4">
          <button
            onClick={() => setFilterLang(null)}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              !filterLang
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
            }`}
          >
            All
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setFilterLang(filterLang === lang ? null : lang)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                filterLang === lang
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No repos match your filters.</p>
        ) : (
          filtered.map((repo) => <RepoCard key={repo.id} repo={repo} />)
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Showing {filtered.length} of {repos.length} repositories
      </p>
    </div>
  );
};

export default RepoList;
