'use client';

import { QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { env } from '@/lib/env';

// Define default options with proper types
const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    refetchOnWindowFocus: true,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  },
  mutations: {
    retry: 1,
  },
};

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions })
  );

  // Set up error handlers
  queryClient.setMutationDefaults([], {
    onError: (error: Error) => {
      if (env.isDev) {
        console.error('Mutation error:', error);
      }
      toast.error('Error updating data');
    },
  });

  queryClient.setQueryDefaults([], {
    onError: (error: Error) => {
      if (env.isDev) {
        console.error('Query error:', error);
      }
      toast.error('Error loading data');
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
