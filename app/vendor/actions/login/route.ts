import { type NextRequest, NextResponse } from "next/server";

import { resolveVendorLoginFormResult } from "@/features/vendor/public/vendor-form-routes";
import { resolveSecureCookieSetting } from "@/lib/cookie-security";

import { buildVendorActionRedirectUrl } from "../redirect-url";

export async function POST(request: NextRequest) {
  const result = await resolveVendorLoginFormResult(
    await request.formData(),
    resolveSecureCookieSetting({
      forwardedProto: request.headers.get("x-forwarded-proto"),
      host: request.headers.get("host"),
    }),
  );
  const response = NextResponse.redirect(buildVendorActionRedirectUrl(result.route, request), 303);
  if (result.cookie) {
    response.cookies.set(result.cookie.name, result.cookie.value, result.cookie.options);
  }

  return response;
}
