'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'COACH' | 'STUDENT';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated' && requiredRole && session?.user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [status, session, router, requiredRole]);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (status === 'authenticated') {
    if (requiredRole && session?.user?.role !== requiredRole) {
      return null;
    }
    return <>{children}</>;
  }

  return null;
}
