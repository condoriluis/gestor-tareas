import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/utils/jwt';

const protectedRoutes = ['/task'];
const publicRoutes = ['/login', '/register', '/forgot-password', '/'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/users')) {
    return NextResponse.redirect(new URL('/task', request.url));
  }

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  const isPublic = publicRoutes.includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      const decoded = await verifyJwt(token);
      
      if (isPublic) {
        return NextResponse.redirect(new URL('/task', request.url));
      }
    } catch {
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
