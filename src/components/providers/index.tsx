'use client';

import { ThemeProvider } from './theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}