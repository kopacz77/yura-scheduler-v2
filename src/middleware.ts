import { withAuth } from 'next-auth/middleware';
import { Role } from '@prisma/client';

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Require any valid token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/students/:path*',
    '/schedule/:path*',
    '/payments/:path*',
    '/admin/:path*',
  ],
};