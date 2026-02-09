interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
    <div className="text-5xl mb-4">⚠️</div>
    <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
    <p className="text-muted-foreground max-w-sm mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
