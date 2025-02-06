import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from './prisma';
import { compare } from 'bcryptjs';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: Role;
      emailVerified: Date | null;
    };
  }
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  pages: { signIn: '/auth/signin' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role as Role,
          emailVerified: user.emailVerified
        }
      };
    },
  },
} satisfies NextAuthConfig;

// Helper to get auth session in route handlers
export const auth = async () => {
  const session = await getServerSession(authConfig);
  return session;
};

// Export auth config for API routes
export default authConfig;