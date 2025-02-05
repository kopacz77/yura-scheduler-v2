import { ReactNode } from 'react';
import { NextAuthProvider } from './NextAuthProvider';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      themes={["light", "dark", "system"]}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}