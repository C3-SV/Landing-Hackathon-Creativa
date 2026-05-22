import { NextResponse, type NextRequest } from "next/server";
import { hasPreviewAccessInRequest } from "@/lib/auth/preview-access";
import { APP_ENV } from "@/lib/constants/env";

const LOGIN_PATH = "/login";

function withNextParam(pathname: string, search: string) {
  if (pathname === "/") {
    return null;
  }

  return `${pathname}${search}`;
}

export function proxy(request: NextRequest) {
  if (!APP_ENV.siteLockEnabled) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const hasAccess = hasPreviewAccessInRequest(request);

  if (pathname.startsWith("/api/preview/")) {
    return NextResponse.next();
  }

  if (pathname === LOGIN_PATH) {
    if (hasAccess) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (hasAccess) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  const nextPath = withNextParam(pathname, search);
  if (nextPath) {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|llms.txt|manifest.webmanifest).*)",
  ],
};
