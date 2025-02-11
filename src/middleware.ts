import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to auth-related paths
    if (path.startsWith('/api/auth/') || path === '/signin' || path === '/error') {
      return NextResponse.next();
    }

    // Must be authenticated from this point
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
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
        const path = req.nextUrl.pathname;
        
        // Always allow signin and auth API routes
        if (path === '/signin' || path.startsWith('/api/auth/')) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protect all routes except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:jpg|jpeg|gif|png|svg|ico)$).*)',
  ],
};
