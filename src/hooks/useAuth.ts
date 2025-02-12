import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@prisma/client';
import { ExtendedSession } from '@/lib/auth';

type UseAuthOptions = {
  required?: boolean;
  role?: Role;
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useAuth(options: UseAuthOptions = {}) {
  const { required = true, role, redirectTo = '/signin', onSuccess, onError } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  const extendedSession = session as ExtendedSession | null;
  const userRole = extendedSession?.user?.role;

  useEffect(() => {
    if (status === 'loading') return;

    if (required && !session) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const callbackUrl = encodeURIComponent(currentPath);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
      onError?.(new Error('Authentication required'));
      return;
    }

    if (role && userRole !== role) {
      const redirectPath = userRole === 'ADMIN' ? '/admin/dashboard' : '/student-portal';
      router.push(redirectPath);
      onError?.(new Error('Insufficient permissions'));
      return;
    }

    if (session) {
      onSuccess?.();
    }
  }, [session, status, required, role, userRole, router, redirectTo, onSuccess, onError]);

  return {
    session: extendedSession,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isAuthorized: !role || userRole === role,
    userRole,
  };
}
