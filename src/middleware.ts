import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Exclude sign-in page from token check
    if (req.nextUrl.pathname === '/signin') {
      // If already signed in, redirect to appropriate dashboard
      if (req.nextauth.token) {
        const role = req.nextauth.token.role;
        const redirectUrl = role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
      return NextResponse.next();
    }

    // All other routes need authentication
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Role-based access control
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/student') && token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow public access to sign-in page
        if (req.nextUrl.pathname === '/signin') {
          return true;
        }
        // All other routes require authentication
        return !!token;
      }
    },
  }
);

export const config = {
  matcher: [
    '/signin',
    '/admin/:path*',
    '/student/:path*',
    '/dashboard/:path*',
  ],
};
