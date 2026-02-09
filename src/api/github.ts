export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  size: number;
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  reset: number;
}

export class GitHubApiError extends Error {
  status: number;
  rateLimit?: RateLimitInfo;

  constructor(message: string, status: number, rateLimit?: RateLimitInfo) {
    super(message);
    this.status = status;
    this.rateLimit = rateLimit;
    this.name = "GitHubApiError";
  }
}

function parseRateLimit(headers: Headers): RateLimitInfo {
  return {
    remaining: parseInt(headers.get("x-ratelimit-remaining") || "60", 10),
    limit: parseInt(headers.get("x-ratelimit-limit") || "60", 10),
    reset: parseInt(headers.get("x-ratelimit-reset") || "0", 10),
  };
}

const BASE_URL = "https://api.github.com";

let activeController: AbortController | null = null;

export function cancelPendingRequests() {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
    signal,
  });

  const rateLimit = parseRateLimit(res.headers);

  if (!res.ok) {
    if (res.status === 403 && rateLimit.remaining === 0) {
      throw new GitHubApiError(
        "GitHub rate limit reached. Try again later.",
        403,
        rateLimit
      );
    }
    if (res.status === 404) {
      throw new GitHubApiError("User not found", 404);
    }
    throw new GitHubApiError(`GitHub API error (${res.status})`, res.status);
  }

  return res.json();
}

export async function fetchUser(
  username: string,
  signal?: AbortSignal
): Promise<GitHubUser> {
  return request<GitHubUser>(`/users/${username}`, signal);
}

export async function fetchRepos(
  username: string,
  signal?: AbortSignal
): Promise<GitHubRepo[]> {
  return request<GitHubRepo[]>(
    `/users/${username}/repos?per_page=100&sort=updated`,
    signal
  );
}

export async function fetchUserData(
  username: string
): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  cancelPendingRequests();
  activeController = new AbortController();
  const signal = activeController.signal;

  const [user, repos] = await Promise.all([
    fetchUser(username, signal),
    fetchRepos(username, signal),
  ]);

  activeController = null;
  return { user, repos };
}
