import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const role = token?.role;

    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return null;
    }

    // Handle admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return null;
    }

    // Handle student routes
    if (request.nextUrl.pathname.startsWith('/student')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      if (role !== 'STUDENT') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return null;
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/student/:path*',
    '/auth/:path*',
    '/settings/:path*',
  ],
};