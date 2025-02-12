import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole?: 'ADMIN' | 'STUDENT') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      const currentPath = window.location.pathname;
      router.push(`/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      const redirectPath = requiredRole === 'ADMIN' ? '/student/dashboard' : '/admin/dashboard';
      router.push(redirectPath);
    }
  }, [session, status, requiredRole, router]);

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    isAuthorized: !requiredRole || session?.user.role === requiredRole,
  };
}
