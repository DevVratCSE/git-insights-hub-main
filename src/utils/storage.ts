import type { GitHubUser, GitHubRepo } from "@/api/github";

const FAVORITES_KEY = "gitscope_favorites";
const CACHE_KEY = "gitscope_cache";

export function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addFavorite(username: string): string[] {
  const favs = getFavorites();
  if (!favs.includes(username.toLowerCase())) {
    favs.push(username.toLowerCase());
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
  return favs;
}

export function removeFavorite(username: string): string[] {
  const favs = getFavorites().filter((f) => f !== username.toLowerCase());
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(username: string): boolean {
  return getFavorites().includes(username.toLowerCase());
}

interface CachedData {
  user: GitHubUser;
  repos: GitHubRepo[];
  timestamp: number;
}

export function cacheUserData(user: GitHubUser, repos: GitHubRepo[]) {
  const data: CachedData = { user, repos, timestamp: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export function getCachedData(): CachedData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachedData = JSON.parse(raw);
    // Cache valid for 10 minutes
    if (Date.now() - data.timestamp > 10 * 60 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}
