import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Return early if trying to access the sign-in page
    if (req.nextUrl.pathname === '/signin') {
      return NextResponse.next();
    }

    // Get the user's token
    const token = req.nextauth.token;

    // Check role-based access
    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/student') && token?.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/signin',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/dashboard/:path*',
    '/signin'
  ],
};
