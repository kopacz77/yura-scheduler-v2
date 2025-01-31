'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'student' | 'coach';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock authentication for now
    setUser({
      id: '1',
      name: 'Yura Min',
      email: 'yura@example.com',
      role: 'admin'
    });
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    // TODO: Implement actual login logic
    console.log('Login attempted with:', credentials);
  };

  const logout = async () => {
    // TODO: Implement actual logout logic
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}