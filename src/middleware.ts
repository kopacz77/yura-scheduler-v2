import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isPublicPage = req.nextUrl.pathname === '/';

  // Redirect from auth pages if already logged in
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL(
      token.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard',
      req.url
    ));
  }

  // Allow public pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected pages while not authenticated
  if (!isAuth && !isAuthPage) {
    const from = req.nextUrl.pathname;
    return NextResponse.redirect(new URL(
      `/auth/signin?from=${encodeURIComponent(from)}`,
      req.url
    ));
  }

  // Handle role-based access
  if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/student/dashboard', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/student') && token?.role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/admin/:path*',
    '/student/:path*',
  ],
};