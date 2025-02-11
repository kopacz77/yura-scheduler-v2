'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudentError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md rounded-lg bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Failed to load students</h2>
        <p className="mb-4 text-muted-foreground">
          {error.message || 'An unexpected error occurred while loading students.'}
        </p>
        <button
          onClick={reset}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}