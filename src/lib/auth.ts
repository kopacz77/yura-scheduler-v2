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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'you@example.com'
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              emailVerified: true,
            },
          });

          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          if (!user.emailVerified) {
            throw new Error('Email not verified');
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
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
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
        // Initial sign in
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      } else {
        // Check token validity on subsequent requests
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { 
            id: true,
            role: true,
            emailVerified: true 
          }
        });

        if (!dbUser || !dbUser.emailVerified) {
          return null; // Token no longer valid
        }
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
      if (url === '/signin') {
        // Go to appropriate dashboard after sign in
        return '/admin/dashboard';
      }
      
      // Allow internal URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default to home
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs to see what's happening
};
