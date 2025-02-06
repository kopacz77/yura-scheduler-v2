'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
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
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  logout: async () => {},
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

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error as Error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        error,
        logout,
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