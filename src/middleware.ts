import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl;

    // Auth page handling
    if (url.pathname.startsWith('/(auth)') || url.pathname === '/signin') {
      if (token) {
        // Redirect authenticated users to their appropriate dashboard
        return NextResponse.redirect(
          new URL(
            token.role === 'ADMIN' ? '/admin/dashboard' : '/student-portal',
            req.url
          )
        );
      }
      return NextResponse.next();
    }

    // Protected routes require authentication
    if (!token) {
      const callbackUrl = encodeURIComponent(url.pathname + url.search);
      return NextResponse.redirect(
        new URL(`/signin?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    // Role-based access control
    if (url.pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/student-portal', req.url));
    }

    if (url.pathname.startsWith('/student-portal') && token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow public routes
        if (req.nextUrl.pathname.startsWith('/(auth)') || 
            req.nextUrl.pathname === '/signin') {
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
