import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value; 
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Pathname: ${pathname}`);
  console.log(`[Middleware] Token: ${token ? 'Exists' : 'Does NOT exist'}`);
  console.log(`[Middleware] User Role: ${userRole}`);

  // Define protected routes and their required roles
  const protectedRoutes = {
    '/seller-dashboard': 'seller',
    '/admin-dashboard': 'admin',
    '/dashboard': 'customer', 
  };

  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const requiredRole = protectedRoutes[route as keyof typeof protectedRoutes];
      console.log(`[Middleware] Protected Route Match: ${route}, Required Role: ${requiredRole}`);

      if (!token) {
        console.log('[Middleware] No token found, redirecting to login.');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // For all roles, check the userRole from cookie
      if (userRole !== requiredRole) {
        console.log(`[Middleware] Role mismatch. User Role: ${userRole}, Required Role: ${requiredRole}. Redirecting to login.`);
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  console.log('[Middleware] Access granted.');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/seller-dashboard/:path*',
    '/admin-dashboard/:path*',
    '/dashboard/:path*', 
  ],
}; 