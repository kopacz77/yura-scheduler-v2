import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define routes that require authentication and their roles
const protectedRoutes = {
  '/admin': ['ADMIN'],
  '/student': ['STUDENT'],
  '/schedule': ['ADMIN', 'STUDENT'],
};

// Routes that don't require authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/api/auth',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access for protected routes
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) && !roles.includes(token.role as string)) {
      // Redirect based on role
      switch (token.role) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        case 'STUDENT':
          return NextResponse.redirect(new URL('/student/dashboard', request.url));
        default:
          return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  // Allow access to other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except static files and api routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};