import type { GitHubUser, GitHubRepo } from "@/api/github";

export interface LanguageStat {
  name: string;
  count: number;
  stars: number;
}

export interface ProfileInsights {
  topLanguages: LanguageStat[];
  mostStarredRepo: GitHubRepo | null;
  mostRecentRepo: GitHubRepo | null;
  totalStars: number;
  totalForks: number;
  healthScore: number;
}

export function computeInsights(
  user: GitHubUser,
  repos: GitHubRepo[]
): ProfileInsights {
  const langMap = new Map<string, { count: number; stars: number }>();
  let totalStars = 0;
  let totalForks = 0;

  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;
    if (repo.language) {
      const prev = langMap.get(repo.language) || { count: 0, stars: 0 };
      langMap.set(repo.language, {
        count: prev.count + 1,
        stars: prev.stars + repo.stargazers_count,
      });
    }
  }

  const topLanguages = Array.from(langMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const mostStarredRepo = repos.length
    ? repos.reduce((a, b) =>
        a.stargazers_count >= b.stargazers_count ? a : b
      )
    : null;

  const mostRecentRepo = repos.length
    ? repos.reduce((a, b) =>
        new Date(a.pushed_at) >= new Date(b.pushed_at) ? a : b
      )
    : null;

  // Health score: 0–100
  const followerScore = Math.min(user.followers / 100, 1) * 25;
  const repoScore = Math.min(user.public_repos / 30, 1) * 20;
  const starScore = Math.min(totalStars / 200, 1) * 25;

  const daysSinceUpdate = mostRecentRepo
    ? (Date.now() - new Date(mostRecentRepo.pushed_at).getTime()) /
      (1000 * 60 * 60 * 24)
    : 365;
  const activityScore = Math.max(0, 1 - daysSinceUpdate / 180) * 30;

  const healthScore = Math.round(
    followerScore + repoScore + starScore + activityScore
  );

  return {
    topLanguages,
    mostStarredRepo,
    mostRecentRepo,
    totalStars,
    totalForks,
    healthScore: Math.min(healthScore, 100),
  };
}
