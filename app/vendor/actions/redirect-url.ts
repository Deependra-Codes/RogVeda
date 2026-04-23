import type { NextRequest } from "next/server";

export function buildVendorActionRedirectUrl(route: string, request: NextRequest) {
  const referer = request.headers.get("referer");
  const origin = referer ? new URL(referer).origin : new URL(request.url).origin;

  return new URL(route, origin);
}
