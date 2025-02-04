import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export const auth: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role as Role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    // Add your providers here
  ],
};

export { Role };
