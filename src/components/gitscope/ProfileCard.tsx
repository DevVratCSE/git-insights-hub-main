import type { GitHubUser } from "@/api/github";
import { formatCount } from "@/utils/formatters";
import { MapPin, Users, BookOpen, ExternalLink, Link as LinkIcon } from "lucide-react";

interface ProfileCardProps {
  user: GitHubUser;
  isFav: boolean;
  onToggleFav: () => void;
}

const ProfileCard = ({ user, isFav, onToggleFav }: ProfileCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 glow-border animate-fade-in">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-20 h-20 rounded-full ring-2 ring-border"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">
            {user.name || user.login}
          </h2>
          <p className="text-sm font-mono text-primary">@{user.login}</p>
          {user.location && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {user.location}
            </p>
          )}
        </div>
      </div>

      {user.bio && (
        <p className="text-sm text-secondary-foreground mb-4 leading-relaxed">{user.bio}</p>
      )}

      <div className="flex gap-6 mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{formatCount(user.followers)}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" /> Followers
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{formatCount(user.following)}</p>
          <p className="text-xs text-muted-foreground">Following</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{formatCount(user.public_repos)}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Repos
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-surface-hover transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> GitHub Profile
        </a>
        {user.blog && (
          <a
            href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-surface-hover transition-colors"
          >
            <LinkIcon className="w-3 h-3" /> Website
          </a>
        )}
        <button
          onClick={onToggleFav}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            isFav
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
          }`}
        >
          {isFav ? "★ Favorited" : "☆ Favorite"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
