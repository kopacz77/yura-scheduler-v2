import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['ADMIN'],
  '/dashboard': ['ADMIN', 'COACH'],
  '/student-portal': ['STUDENT'],
  '/api/rinks': ['ADMIN'],
  '/api/timeslots': ['ADMIN'],
  '/api/payments/verify': ['ADMIN'],
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/_next',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if the user is authenticated
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access for protected routes
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) && !roles.includes(token.role as string)) {
      // Redirect to appropriate dashboard based on role
      switch (token.role) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        case 'COACH':
          return NextResponse.redirect(new URL('/dashboard', request.url));
        case 'STUDENT':
          return NextResponse.redirect(new URL('/student-portal', request.url));
        default:
          return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    }
  }

  // Special handling for root path
  if (pathname === '/') {
    switch (token.role) {
      case 'ADMIN':
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      case 'COACH':
        return NextResponse.redirect(new URL('/dashboard', request.url));
      case 'STUDENT':
        return NextResponse.redirect(new URL('/student-portal', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};