import { useState, useEffect, useCallback, useMemo } from "react";
import type { GitHubUser, GitHubRepo } from "@/api/github";
import { GitHubApiError, fetchUserData } from "@/api/github";
import { debounce } from "@/utils/debounce";
import { computeInsights } from "@/utils/insights";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  cacheUserData,
  getCachedData,
} from "@/utils/storage";

import HeaderSearch from "@/components/gitscope/HeaderSearch";
import ProfileCard from "@/components/gitscope/ProfileCard";
import InsightsPanel from "@/components/gitscope/InsightsPanel";
import RepoList from "@/components/gitscope/RepoList";
import ProfileSkeleton from "@/components/gitscope/ProfileSkeleton";
import InsightsSkeleton from "@/components/gitscope/InsightsSkeleton";
import EmptyState from "@/components/gitscope/EmptyState";
import ErrorState from "@/components/gitscope/ErrorState";
import FavoritesDrawer from "@/components/gitscope/FavoritesDrawer";
import CompareView from "@/components/gitscope/CompareView";

type ViewState =
  | { type: "initial" }
  | { type: "loading" }
  | { type: "loaded"; user: GitHubUser; repos: GitHubRepo[] }
  | { type: "not-found"; username: string }
  | { type: "rate-limit"; resetTime?: number; remaining?: number }
  | { type: "error"; message: string };

const Index = () => {
  const [query, setQuery] = useState("");
  const [viewState, setViewState] = useState<ViewState>({ type: "initial" });
  const [compareMode, setCompareMode] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(getFavorites());

  const searchUser = useCallback(async (username: string) => {
    if (!username.trim()) return;
    setViewState({ type: "loading" });

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("user", username.trim());
    window.history.replaceState(null, "", url.toString());

    try {
      const data = await fetchUserData(username.trim());
      cacheUserData(data.user, data.repos);
      setViewState({ type: "loaded", user: data.user, repos: data.repos });
    } catch (err) {
      if (err instanceof GitHubApiError) {
        if (err.status === 404) {
          setViewState({ type: "not-found", username: username.trim() });
        } else if (err.status === 403 && err.rateLimit) {
          setViewState({
            type: "rate-limit",
            resetTime: err.rateLimit.reset,
            remaining: err.rateLimit.remaining,
          });
        } else {
          setViewState({ type: "error", message: err.message });
        }
      } else if (err instanceof Error && err.name === "AbortError") {
        // Request was cancelled, ignore
      } else {
        setViewState({ type: "error", message: "An unexpected error occurred" });
      }
    }
  }, []);

  // Load from URL param or cache on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    if (userParam) {
      setQuery(userParam);
      searchUser(userParam);
    } else {
      const cached = getCachedData();
      if (cached) {
        setQuery(cached.user.login);
        setViewState({ type: "loaded", user: cached.user, repos: cached.repos });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((q: string) => searchUser(q), 300),
    [searchUser]
  );

  const handleQueryChange = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      debouncedSearch(q);
    }
  };

  const handleSearch = () => searchUser(query);

  const handleToggleFav = () => {
    if (viewState.type !== "loaded") return;
    const username = viewState.user.login;
    if (isFavorite(username)) {
      setFavorites(removeFavorite(username));
    } else {
      setFavorites(addFavorite(username));
    }
  };

  const handleSelectFavorite = (username: string) => {
    setQuery(username);
    setCompareMode(false);
    searchUser(username);
  };

  const handleRemoveFavorite = (username: string) => {
    setFavorites(removeFavorite(username));
  };

  const insights = useMemo(() => {
    if (viewState.type !== "loaded") return null;
    return computeInsights(viewState.user, viewState.repos);
  }, [viewState]);

  return (
    <div className="min-h-screen bg-background">
      <HeaderSearch
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        compareMode={compareMode}
        onToggleCompare={() => setCompareMode(!compareMode)}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {compareMode ? (
          <CompareView />
        ) : (
          <>
            {viewState.type === "initial" && <EmptyState type="initial" />}

            {viewState.type === "not-found" && (
              <EmptyState type="not-found" username={viewState.username} />
            )}

            {viewState.type === "rate-limit" && (
              <EmptyState
                type="rate-limit"
                resetTime={viewState.resetTime}
                remaining={viewState.remaining}
                onRetry={handleSearch}
              />
            )}

            {viewState.type === "error" && (
              <ErrorState message={viewState.message} onRetry={handleSearch} />
            )}

            {viewState.type === "loading" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <ProfileSkeleton />
                  <InsightsSkeleton />
                </div>
                <div className="lg:col-span-2">
                  <div className="h-5 w-32 skeleton-pulse mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
                        <div className="h-5 w-40 skeleton-pulse" />
                        <div className="h-4 w-full skeleton-pulse" />
                        <div className="flex gap-4">
                          <div className="h-4 w-12 skeleton-pulse" />
                          <div className="h-4 w-12 skeleton-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewState.type === "loaded" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <ProfileCard
                    user={viewState.user}
                    isFav={isFavorite(viewState.user.login)}
                    onToggleFav={handleToggleFav}
                  />
                  {insights && <InsightsPanel insights={insights} />}
                </div>
                <div className="lg:col-span-2">
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                    Repositories ({viewState.repos.length})
                  </h2>
                  <RepoList repos={viewState.repos} loading={false} />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <FavoritesDrawer
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onSelect={handleSelectFavorite}
        onRemove={handleRemoveFavorite}
      />
    </div>
  );
};

export default Index;
