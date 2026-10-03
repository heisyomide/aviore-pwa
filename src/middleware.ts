import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  const hostname = request.headers.get("host") || "";

  const currentHost = hostname
    .split(":")[0]
    .replace(/^www\./, "");

  const isAppSubdomain = currentHost.startsWith("app.");

  /*
   * ---------------------------------------------------------
   * MARKETING DOMAIN
   * ---------------------------------------------------------
   *
   * www.aviorego.com.ng
   * aviorego.com.ng
   *
   * Let the marketing site handle its own routes normally.
   */
  if (!isAppSubdomain) {
    return NextResponse.next();
  }

  /*
   * ---------------------------------------------------------
   * PUBLIC APP ROUTES
   * ---------------------------------------------------------
   *
   * These routes must always be accessible without login
   * or role cookies.
   */
  const publicAppRoutes = [
    "/",
    "/onboarding",
    "/login",
    "/organizer/signup",
    "/organizer/onboarding",
  ];

  if (publicAppRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  /*
   * ---------------------------------------------------------
   * ROLE-BASED PROTECTION
   * ---------------------------------------------------------
   */

  const userRole = request.cookies.get("user_role")?.value;

  // Rider
  if (
    pathname.startsWith("/rider") &&
    userRole !== "RIDER"
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Business
  if (
    pathname.startsWith("/business") &&
    userRole !== "BUSINESS_OWNER"
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Organizer
  if (
    pathname.startsWith("/organizer") &&
    userRole !== "ORGANIZER"
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on application routes,
     * but not Next internals or API routes.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};