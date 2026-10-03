// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const hostname = request.headers.get('host') || '';

  // 1. DOMAIN SEPARATION LOGIC
  const currentHost = hostname.replace(/^(www\.)?/, '');
  const isSubdomain = currentHost.startsWith('app.');

  // If they are visiting the ROOT DOMAIN (aviorgodos.com.ng)
  if (!isSubdomain) {
    // Allow static assets, api, and next internals to load normally
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
      return NextResponse.next();
    }

    // If they are trying to access app routes from the marketing domain, block or redirect them,
    // OR simply serve the root marketing page (since your marketing page is at app/page.tsx)
    // By default, a request to aviorgodos.com.ng/ hits app/page.tsx automatically!
    return NextResponse.next();
  }

  // 2. APP / PWA SUBDOMAIN & ROLE-BASED PROTECTION LOGIC
  // (This executes when they are on app.aviorgodos.com.ng)
  const userRole = request.cookies.get('user_role')?.value;

  // Allow public access to organizer signup and onboarding pages
  if (pathname === '/organizer/signup' || pathname === '/organizer/onboarding') {
    return NextResponse.next();
  }

  // Protect Rider routes
  if (pathname.startsWith('/rider') && userRole !== 'RIDER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect Business routes
  if (pathname.startsWith('/business') && userRole !== 'BUSINESS_OWNER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect other Organizer routes (except signup/onboarding)
  if (pathname.startsWith('/organizer') && userRole !== 'ORGANIZER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};