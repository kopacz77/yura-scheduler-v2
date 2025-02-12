import { NextAuthOptions, Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export interface ExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60,   // 1 hour
  },
  pages: {
    signIn: '/signin',
    error: '/(auth)/error',
    signOut: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              active: true,
            },
          });

          if (!user || !user.password || !user.active) {
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
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as Role,
          email: token.email as string,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      // Prevents open redirects
      const targetUrl = new URL(url, baseUrl);
      
      if (targetUrl.origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
