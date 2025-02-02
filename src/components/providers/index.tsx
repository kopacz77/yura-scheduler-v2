'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <MainLayout>
          {children}
          <Toaster />
        </MainLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}
