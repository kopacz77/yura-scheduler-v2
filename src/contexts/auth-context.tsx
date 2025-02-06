'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: Date | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(session.user as User);
      
      // Redirect based on role
      const path = session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
      router.push(path);
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}