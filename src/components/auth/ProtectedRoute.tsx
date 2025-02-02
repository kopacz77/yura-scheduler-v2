'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { LoadingPage } from '../loading/LoadingPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
      // Redirect based on role
      switch (session.user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'STUDENT':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [session, status, router, pathname, allowedRoles]);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (!session) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return null;
  }

  return <>{children}</>;
}