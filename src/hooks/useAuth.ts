import { useState, useEffect } from 'react';

interface User {
  id: string;
  role: 'admin' | 'student';
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock authentication for now
    // TODO: Replace with actual auth integration
    setUser({
      id: '1',
      role: 'admin',
      name: 'Yura Min',
      email: 'yura@example.com'
    });
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    // TODO: Implement real login
    console.log('Login:', credentials);
  };

  const logout = async () => {
    // TODO: Implement real logout
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
}