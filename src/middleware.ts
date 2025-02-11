import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow public routes
    if (path === '/signin' || path === '/signup' || path.startsWith('/api/auth')) {
      // If user is already authenticated, redirect to appropriate dashboard
      if (token) {
        return NextResponse.redirect(
          new URL(
            token.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard',
            req.url
          )
        );
      }
      return NextResponse.next();
    }

    // Handle root path
    if (path === '/') {
      if (!token) {
        return NextResponse.redirect(new URL('/signin', req.url));
      }
      return NextResponse.redirect(
        new URL(
          token.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard',
          req.url
        )
      );
    }

    // Protected routes
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Role-based access control
    if (path.startsWith('/admin/') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }

    if (path.startsWith('/student/') && token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        return true; // Authorization is handled in the middleware function
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
