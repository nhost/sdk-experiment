import { NextRequest, NextResponse } from 'next/server';
import { createClient, extractTokenExpiration } from 'nhost-js';
import { createServerMiddlewareCookieStorage } from './app/lib/nhost/ssr';

// Define public routes that don't require authentication
const publicRoutes = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  // Create a response that we'll modify as needed
  const response = NextResponse.next();

  // Create the Nhost client with server storage
  const nhost = createClient({
    region: 'local',
    subdomain: 'local',
    storage: createServerMiddlewareCookieStorage(request, response),
  });

  // Get the current path
  const path = request.nextUrl.pathname;

  // Check if this is a public route or a public asset
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));

  // If it's a public route, allow access without checking auth
  if (isPublicRoute) {
    return response;
  }

  // Check for public assets and API routes that shouldn't be protected
  if (path.startsWith('/_next') || path.startsWith('/api/') || path === '/') {
    return response;
  }

  // Get the session from the storage
  const session = nhost.getUserSession();

  // Check if the session is valid
  const tokenExpiresAt = extractTokenExpiration(session?.accessToken || '');
  const currentTime = Date.now();
  if (tokenExpiresAt - currentTime < 60 * 1000) {
      const _ = await nhost.storage.getVersion();
  }

  // If no session and not a public route, redirect to signin
  if (!session) {
    const signInUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Session exists, allow access to protected route
  return response;
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
