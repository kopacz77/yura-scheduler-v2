import { useSession } from 'next-auth/react';
import { Role } from '@prisma/client';

interface UseAuthProps {
  required?: boolean;
  role?: Role;
}

export function useAuth(props: UseAuthProps = {}) {
  const { data: session, status } = useSession({
    required: props.required,
  });

  const isLoading = status === 'loading';
  const isAuthenticated = !!session;
  const userRole = session?.user?.role;
  const isAuthorized = !props.role || userRole === props.role;

  return {
    session,
    isLoading,
    isAuthenticated,
    isAuthorized,
    userRole,
  };
}
