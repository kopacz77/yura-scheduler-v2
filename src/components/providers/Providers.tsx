'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/app/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { RouteChangeLoader } from '@/components/loading/RouteChangeLoader';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AppProvider>
          {children}
          <Toaster />
          <RouteChangeLoader />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}