import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  pages: {
    signIn: '/signin',
    error: '/auth/error',
    signOut: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // On initial sign in
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role as Role;
        session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always allow the sign-in page
      if (url.includes('/signin')) {
        return url;
      }

      // Keep internal URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Get user role for redirect
      const user = await prisma.user.findFirst({
        where: {
          email: token?.email as string,
        },
        select: {
          role: true
        }
      });

      // Redirect based on role
      if (user?.role === Role.ADMIN) {
        return `${baseUrl}/admin/dashboard`;
      }
      if (user?.role === Role.STUDENT) {
        return `${baseUrl}/student/dashboard`;
      }

      // Default to home
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};
