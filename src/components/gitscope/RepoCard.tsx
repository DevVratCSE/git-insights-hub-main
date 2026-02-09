import type { GitHubRepo } from "@/api/github";
import { formatDate, truncate, formatCount } from "@/utils/formatters";
import { Star, GitFork } from "lucide-react";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Lua: "#000080",
  Scala: "#c22d40",
};

interface RepoCardProps {
  repo: GitHubRepo;
}

const RepoCard = ({ repo }: RepoCardProps) => {
  const langColor = repo.language ? LANG_COLORS[repo.language] || "#8b8b8b" : null;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-border bg-card p-4 card-hover"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-primary truncate font-mono">
          {repo.name}
        </h3>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(repo.pushed_at || repo.updated_at)}
        </span>
      </div>

      {repo.description && (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          {truncate(repo.description, 100)}
        </p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5 text-xs text-badge-foreground">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: langColor || "#8b8b8b" }}
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3" /> {formatCount(repo.stargazers_count)}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <GitFork className="w-3 h-3" /> {formatCount(repo.forks_count)}
          </span>
        )}
      </div>
    </a>
  );
};

export default RepoCard;
