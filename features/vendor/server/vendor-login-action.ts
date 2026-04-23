"use server";

import { redirect } from "next/navigation";

import {
  buildVendorDashboardRoute,
  buildVendorLoginRoute,
  parseVendorLoginPayload,
} from "../types/contracts";
import { authenticateVendor } from "./authenticate-vendor";
import { setVendorSession } from "./session";

export async function vendorLoginAction(formData: FormData) {
  const parsed = parseVendorLoginPayload(formData);
  if (!parsed.success) {
    redirect(buildVendorLoginRoute("invalid_request"));
  }

  const authResult = await authenticateVendor(parsed.data);
  if (authResult.kind === "invalid_credentials") {
    redirect(buildVendorLoginRoute("invalid_credentials"));
  }

  if (authResult.kind === "unconfigured" || authResult.kind === "error") {
    redirect(buildVendorLoginRoute("service_unavailable"));
  }

  await setVendorSession(authResult.vendor);

  redirect(
    buildVendorDashboardRoute({
      status: "signed_in",
    }),
  );
}
