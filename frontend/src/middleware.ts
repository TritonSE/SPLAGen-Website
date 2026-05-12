import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const LANGS = ["en", "es", "pt"];

export function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // If the URL starts with a supported language code, strip it and set the
  // i18next cookie so the client-side i18n picks up that language.
  // e.g. /en/signup -> /signup with cookie i18next=en
  if (firstSegment && LANGS.includes(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = "/" + segments.slice(1).join("/");

    const response = NextResponse.redirect(url);
    response.cookies.set("i18next", firstSegment, { path: "/" });
    return response;
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
