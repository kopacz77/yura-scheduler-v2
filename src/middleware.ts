import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public paths
    if (path === '/' || path.startsWith('/auth/')) {
      return NextResponse.next();
    }

    // Must be authenticated from this point
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Admin trying to access student pages
    if (token.role === 'ADMIN' && path.startsWith('/student/')) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Student trying to access admin pages
    if (token.role === 'STUDENT' && path.startsWith('/admin/')) {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow auth pages
        if (req.nextUrl.pathname.startsWith('/auth/')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
