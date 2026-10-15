import { NextResponse, type NextRequest } from "next/server";

// Server components aren't told their own URL; pass it on so pages can look up their goatboat row
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[a-z0-9]+$).*)"],
};
