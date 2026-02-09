import type { ProfileInsights } from "@/utils/insights";
import { Star, GitFork, Clock, Code } from "lucide-react";
import { formatCount } from "@/utils/formatters";

interface InsightsPanelProps {
  insights: ProfileInsights;
}

const ScoreRing = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70 ? "hsl(var(--success))" : score >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="relative w-28 h-28 mx-auto" title={`Profile health: ${score}/100. Based on followers, repo count, stars, and recent activity.`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          className="score-ring"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Health</span>
      </div>
    </div>
  );
};

const InsightsPanel = ({ insights }: InsightsPanelProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 glow-border animate-fade-in space-y-5">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Code className="w-4 h-4 text-primary" /> Insights
      </h3>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary rounded-md p-3 text-center">
          <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-primary" /> {formatCount(insights.totalStars)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase">Total Stars</p>
        </div>
        <div className="bg-secondary rounded-md p-3 text-center">
          <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
            <GitFork className="w-4 h-4 text-primary" /> {formatCount(insights.totalForks)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase">Total Forks</p>
        </div>
      </div>

      {/* Top languages */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Top Languages</p>
        <div className="space-y-2">
          {insights.topLanguages.slice(0, 5).map((lang, i) => {
            const maxCount = insights.topLanguages[0]?.count || 1;
            return (
              <div key={lang.name} className="flex items-center gap-2">
                <span className="text-xs text-secondary-foreground w-20 truncate">{lang.name}</span>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(lang.count / maxCount) * 100}%`,
                      backgroundColor: `hsl(168 ${70 - i * 12}% ${45 + i * 5}%)`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{lang.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        {insights.mostStarredRepo && (
          <div className="flex items-start gap-2">
            <Star className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Most Starred</p>
              <a
                href={insights.mostStarredRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-primary hover:underline"
              >
                {insights.mostStarredRepo.name}
              </a>
              <span className="text-xs text-muted-foreground ml-1">
                ({formatCount(insights.mostStarredRepo.stargazers_count)} ★)
              </span>
            </div>
          </div>
        )}
        {insights.mostRecentRepo && (
          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Most Recent</p>
              <a
                href={insights.mostRecentRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-primary hover:underline"
              >
                {insights.mostRecentRepo.name}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Health Score */}
      <div className="pt-2">
        <ScoreRing score={insights.healthScore} />
      </div>
    </div>
  );
};

export default InsightsPanel;
