'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/layout/MainLayout';
import type { Session } from 'next-auth';

// Props
interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
  disableLayout?: boolean;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Theme provider wrapper
export function ThemeProvider({ 
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// Main providers wrapper
export function Providers({ children, session, disableLayout = false }: ProvidersProps) {
  const content = (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {disableLayout ? children : (
            <MainLayout>
              {children}
              <Toaster />
            </MainLayout>
          )}
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );

  // Optionally wrap in development providers
  if (process.env.NODE_ENV === 'development') {
    return (
      <DevelopmentProvider>
        {content}
      </DevelopmentProvider>
    );
  }

  return content;
}

// Export for convenience
export { DevelopmentProvider } from './DevelopmentProvider';
