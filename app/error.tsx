'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-text-primary">
          Something went wrong!
        </h2>
        <p className="text-text-secondary">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-accent text-background px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-smooth"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
