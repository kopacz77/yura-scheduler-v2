'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingPage } from '@/components/loading/LoadingPage';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Redirect to appropriate dashboard if on root protected route
    if (pathname === '/') {
      if (session.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (session.user.role === 'STUDENT') {
        router.push('/student/dashboard');
      }
    }

    // Ensure users can only access their role-specific routes
    const isAdminRoute = pathname.startsWith('/admin');
    const isStudentRoute = pathname.startsWith('/student');

    if (isAdminRoute && session.user.role !== 'ADMIN') {
      router.push('/student/dashboard');
    } else if (isStudentRoute && session.user.role !== 'STUDENT') {
      router.push('/admin/dashboard');
    }
  }, [session, status, router, pathname]);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (!session) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
