import { useState, useCallback } from "react";
import type { GitHubUser, GitHubRepo } from "@/api/github";
import { GitHubApiError, fetchUserData } from "@/api/github";
import { computeInsights } from "@/utils/insights";
import ProfileCard from "./ProfileCard";
import InsightsPanel from "./InsightsPanel";
import ProfileSkeleton from "./ProfileSkeleton";
import InsightsSkeleton from "./InsightsSkeleton";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { formatCount } from "@/utils/formatters";
import { Users, Star, BookOpen, ArrowLeftRight } from "lucide-react";

interface SideState {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
  errorType?: "not-found" | "rate-limit" | "error";
}

const initialSide: SideState = {
  user: null,
  repos: [],
  loading: false,
  error: null,
};

const CompareView = () => {
  const [usernameA, setUsernameA] = useState("");
  const [usernameB, setUsernameB] = useState("");
  const [sideA, setSideA] = useState<SideState>(initialSide);
  const [sideB, setSideB] = useState<SideState>(initialSide);

  const fetchSide = useCallback(
    async (
      username: string,
      setSide: React.Dispatch<React.SetStateAction<SideState>>
    ) => {
      if (!username.trim()) return;
      setSide({ user: null, repos: [], loading: true, error: null });
      try {
        const data = await fetchUserData(username.trim());
        setSide({ user: data.user, repos: data.repos, loading: false, error: null });
      } catch (err) {
        if (err instanceof GitHubApiError) {
          const errorType = err.status === 404 ? "not-found" : err.status === 403 ? "rate-limit" : "error";
          setSide({ user: null, repos: [], loading: false, error: err.message, errorType });
        } else if (err instanceof Error && err.name !== "AbortError") {
          setSide({ user: null, repos: [], loading: false, error: "An unexpected error occurred", errorType: "error" });
        }
      }
    },
    []
  );

  const handleSearch = () => {
    fetchSide(usernameA, setSideA);
    fetchSide(usernameB, setSideB);
  };

  const totalStars = (repos: GitHubRepo[]) =>
    repos.reduce((acc, r) => acc + r.stargazers_count, 0);

  const topLang = (repos: GitHubRepo[]) => {
    const map = new Map<string, number>();
    repos.forEach((r) => r.language && map.set(r.language, (map.get(r.language) || 0) + 1));
    let best = "—";
    let max = 0;
    map.forEach((v, k) => { if (v > max) { max = v; best = k; } });
    return best;
  };

  const bothLoaded = sideA.user && sideB.user;

  return (
    <div className="animate-fade-in">
      {/* Search inputs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="User A"
          value={usernameA}
          onChange={(e) => setUsernameA(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
        />
        <div className="flex items-center justify-center">
          <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="User B"
          value={usernameB}
          onChange={(e) => setUsernameB(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Compare
        </button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Side A */}
        <div>
          {sideA.loading && <ProfileSkeleton />}
          {sideA.error && sideA.errorType === "not-found" && (
            <EmptyState type="not-found" username={usernameA} />
          )}
          {sideA.error && sideA.errorType === "rate-limit" && (
            <EmptyState type="rate-limit" />
          )}
          {sideA.error && sideA.errorType === "error" && (
            <ErrorState message={sideA.error} onRetry={handleSearch} />
          )}
          {sideA.user && (
            <ProfileCard user={sideA.user} isFav={false} onToggleFav={() => {}} />
          )}
        </div>

        {/* Side B */}
        <div>
          {sideB.loading && <ProfileSkeleton />}
          {sideB.error && sideB.errorType === "not-found" && (
            <EmptyState type="not-found" username={usernameB} />
          )}
          {sideB.error && sideB.errorType === "rate-limit" && (
            <EmptyState type="rate-limit" />
          )}
          {sideB.error && sideB.errorType === "error" && (
            <ErrorState message={sideB.error} onRetry={handleSearch} />
          )}
          {sideB.user && (
            <ProfileCard user={sideB.user} isFav={false} onToggleFav={() => {}} />
          )}
        </div>
      </div>

      {/* Comparison table */}
      {bothLoaded && (
        <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden animate-fade-in">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left p-3 text-xs text-muted-foreground uppercase tracking-wider">Metric</th>
                <th className="text-center p-3 text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  {sideA.user!.login}
                </th>
                <th className="text-center p-3 text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  {sideB.user!.login}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Followers",
                  icon: <Users className="w-3 h-3" />,
                  a: sideA.user!.followers,
                  b: sideB.user!.followers,
                },
                {
                  label: "Public Repos",
                  icon: <BookOpen className="w-3 h-3" />,
                  a: sideA.user!.public_repos,
                  b: sideB.user!.public_repos,
                },
                {
                  label: "Total Stars",
                  icon: <Star className="w-3 h-3" />,
                  a: totalStars(sideA.repos),
                  b: totalStars(sideB.repos),
                },
              ].map((row) => (
                <tr key={row.label} className="border-b border-border">
                  <td className="p-3 text-secondary-foreground flex items-center gap-2">
                    {row.icon} {row.label}
                  </td>
                  <td className={`p-3 text-center font-mono ${row.a > row.b ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {formatCount(row.a)}
                  </td>
                  <td className={`p-3 text-center font-mono ${row.b > row.a ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {formatCount(row.b)}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-border">
                <td className="p-3 text-secondary-foreground">Top Language</td>
                <td className="p-3 text-center font-mono text-foreground">{topLang(sideA.repos)}</td>
                <td className="p-3 text-center font-mono text-foreground">{topLang(sideB.repos)}</td>
              </tr>
              <tr>
                <td className="p-3 text-secondary-foreground">Health Score</td>
                <td className="p-3 text-center font-mono text-primary font-semibold">
                  {computeInsights(sideA.user!, sideA.repos).healthScore}
                </td>
                <td className="p-3 text-center font-mono text-primary font-semibold">
                  {computeInsights(sideB.user!, sideB.repos).healthScore}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompareView;
