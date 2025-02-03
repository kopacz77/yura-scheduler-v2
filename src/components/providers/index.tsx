'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <MainLayout>
          {children}
          <Toaster />
        </MainLayout>
      </AuthProvider>
    </SessionProvider>
  );
}