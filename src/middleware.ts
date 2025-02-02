import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isStudentRoute = request.nextUrl.pathname.startsWith('/student');

  if (!isAuth) {
    if (isAuthPage) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (isAuthPage) {
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  // Protect admin routes
  if (isAdminRoute && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  // Protect student routes
  if (isStudentRoute && token.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/auth/:path*',
  ],
};