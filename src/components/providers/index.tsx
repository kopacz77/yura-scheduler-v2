'use client';

import { ThemeProvider } from './theme-provider';
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
      <MainLayout>{children}</MainLayout>
      <Toaster />
    </ThemeProvider>
  );
}