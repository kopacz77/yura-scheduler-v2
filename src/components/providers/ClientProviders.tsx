'use client';

import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/QueryProvider';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface ClientProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}