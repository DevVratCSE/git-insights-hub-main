import { X, User } from "lucide-react";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onSelect: (username: string) => void;
  onRemove: (username: string) => void;
}

const FavoritesDrawer = ({
  isOpen,
  onClose,
  favorites,
  onSelect,
  onRemove,
}: FavoritesDrawerProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-card border-l border-border z-50 flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Favorites</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No favorites yet. Search for a user and add them!
            </p>
          ) : (
            <div className="space-y-1">
              {favorites.map((username) => (
                <div
                  key={username}
                  className="flex items-center justify-between rounded-md p-2 hover:bg-secondary transition-colors group"
                >
                  <button
                    onClick={() => {
                      onSelect(username);
                      onClose();
                    }}
                    className="flex items-center gap-2 text-sm text-foreground flex-1 text-left"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono">{username}</span>
                  </button>
                  <button
                    onClick={() => onRemove(username)}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesDrawer;
