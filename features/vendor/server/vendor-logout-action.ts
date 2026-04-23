"use server";

import { redirect } from "next/navigation";

import { buildVendorLoginRoute } from "../types/contracts";
import { clearVendorSession } from "./session";

export async function vendorLogoutAction() {
  await clearVendorSession();

  redirect(buildVendorLoginRoute());
}
