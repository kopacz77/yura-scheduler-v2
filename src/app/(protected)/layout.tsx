'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { LoadingPage } from '@/components/loading/LoadingPage';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return <AppShell>{children}</AppShell>;
}