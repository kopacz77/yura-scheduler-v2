import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL(
          token.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard',
          req.url
        ));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Handle role-based access
    if (req.nextUrl.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/student') && token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
};
