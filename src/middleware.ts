import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Already authenticated users trying to access auth pages
    if (path.startsWith('/auth') && token) {
      const destination = token.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(new URL(destination, req.url));
    }

    // Admin trying to access student pages
    if (token?.role === 'ADMIN' && path === '/dashboard') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Student trying to access admin pages
    if (token?.role === 'STUDENT' && path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/auth/')) {
          return true; // Always allow auth pages
        }
        return !!token; // Require auth for all other pages
      }
    }
  }
);

export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
  ]
};