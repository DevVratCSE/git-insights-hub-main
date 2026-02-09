# GitScope – GitHub Profile Analyzer

**Live Demo:** https://akaay.site

GitScope is a frontend web application that analyzes GitHub profiles using the **GitHub public REST API**.  
It provides a clean dashboard to explore user profiles, repositories, language usage, engagement metrics, and side-by-side comparisons.

This project demonstrates real-world REST API integration, data aggregation, UI state handling, and frontend architecture using modern React tooling.

---

## Project Overview

GitScope allows users to:

- Search any public GitHub username
- View profile details and repository statistics
- Analyze languages, stars, forks, and activity
- Compare two GitHub profiles side by side
- Save favorite profiles for quick access

All data is fetched live from GitHub and rendered on the client.

---

## Key Features

### Profile Analysis
- Avatar, name, bio, location, and links
- Followers, following, and repository count
- Direct link to GitHub profile and website (if available)

### Repository Insights
- Full list of public repositories
- Sorting by recent activity, stars, forks, and name
- Language-based filtering
- Repository search
- Stars, forks, descriptions, and last update timestamps

### Analytics & Insights
- Total stars and forks across all repositories
- Top programming languages used
- Most starred repository
- Most recently updated repository
- **Health Score** (derived metric based on activity, popularity, and consistency)

### Compare Mode
- Compare two GitHub users side by side
- Profile metrics comparison (followers, repos, stars, forks)
- Language usage comparison
- Engagement and repository impact comparison

### Favorites
- Save profiles to favorites
- Persist data using localStorage
- Quickly reload saved profiles for comparison or review

### UX & Reliability
- Loading skeletons during API calls
- Graceful handling of:
  - User not found (404)
  - API rate limits
  - Network errors
- Responsive layout for desktop and mobile
- Cached last successful profile for faster reloads

---

## GitHub API Usage

This project uses only **public GitHub REST API endpoints**:

- User profile  
  `GET https://api.github.com/users/{username}`

- User repositories  
  `GET https://api.github.com/users/{username}/repos?per_page=100&sort=updated`

No API keys are required.

> Note: GitHub applies rate limits to unauthenticated requests. The application detects and handles rate-limit responses gracefully.

---

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- GitHub REST API
- localStorage

---

## Project Structure

```text
src/
 ├─ api/            # GitHub API calls
 ├─ components/     # UI components
 ├─ utils/          # helpers (formatting, calculations)
 ├─ App.tsx         # main application logic
 └─ main.tsx        # entry point
