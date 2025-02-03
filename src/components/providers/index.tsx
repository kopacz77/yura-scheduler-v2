'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';

function ThemeContainer({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContainer>
      <SessionProvider>
        <AuthProvider>
          <MainLayout>
            {children}
            <Toaster />
          </MainLayout>
        </AuthProvider>
      </SessionProvider>
    </ThemeContainer>
  );
}