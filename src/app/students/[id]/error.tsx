'use client';

import { ErrorMessage } from '@/components/ui/error';

export default function StudentErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorMessage
      title="Failed to load student profile"
      message={error.message || 'An unexpected error occurred while loading the student profile.'}
      retry={reset}
    />
  );
}