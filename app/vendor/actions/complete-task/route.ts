import { type NextRequest, NextResponse } from "next/server";

import { resolveCompleteTaskFormRoute } from "@/features/vendor/public/vendor-form-routes";

import { buildVendorActionRedirectUrl } from "../redirect-url";

export async function POST(request: NextRequest) {
  const route = await resolveCompleteTaskFormRoute(await request.formData());

  return NextResponse.redirect(buildVendorActionRedirectUrl(route, request), 303);
}
