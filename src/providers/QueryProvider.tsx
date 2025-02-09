'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { env } from '@/lib/env';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000, // 30 seconds
          retry: 2,
          refetchOnWindowFocus: true,
          gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
        mutations: {
          retry: 1,
        },
      },
    });

    // Set up global handlers
    client.setDefaultOptions({
      queries: {
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    });

    // Add mutation defaults
    client.setMutationDefaults([], {
      onError: (error: Error) => {
        if (env.isDev) {
          console.error('Mutation error:', error);
        }
        toast.error('Error updating data');
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
