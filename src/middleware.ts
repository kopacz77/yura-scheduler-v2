import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === '/signin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isStudentRoute = req.nextUrl.pathname.startsWith('/student');
    
    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      if (isAuth) {
        const role = token.role;
        const redirectUrl = role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
      return NextResponse.next();
    }

    // Protected route checks
    if (!isAuth) {
      let callbackUrl = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        callbackUrl += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url)
      );
    }

    // Role-based access control
    if (isAdminRoute && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }

    if (isStudentRoute && token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Public routes
        if (req.nextUrl.pathname === '/signin') {
          return true;
        }
        // Protected routes require authentication
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
    '/schedule/:path*',
    '/settings/:path*',
    '/students/:path*',
    '/payments/:path*',
  ],
};
