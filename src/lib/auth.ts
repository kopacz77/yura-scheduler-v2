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
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role as Role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, redirect based on user role
      if (url.startsWith('/admin') || url.startsWith('/student')) {
        return url; // Keep protected route redirects
      }
      
      if (url === '/signin') {
        return baseUrl; // Redirect to home if trying to access sign in while authenticated
      }

      // Default redirects based on role
      const session = await prisma.session.findFirst({
        where: {
          expires: {
            gt: new Date()
          }
        },
        include: {
          user: true
        },
        orderBy: {
          expires: 'desc'
        }
      });

      if (session?.user?.role === 'ADMIN') {
        return `${baseUrl}/admin/dashboard`;
      }
      
      return `${baseUrl}/student/dashboard`;
    }
  },
  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in`);
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
