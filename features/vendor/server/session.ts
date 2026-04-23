import { cookies } from "next/headers";

import {
  type VendorSessionPayload,
  createVendorSessionToken,
  parseVendorSessionToken,
} from "./session-token";

const vendorSessionCookieName = "rogveda_vendor_session";
const vendorSessionMaxAgeSeconds = 60 * 60 * 12;

export async function readVendorSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(vendorSessionCookieName)?.value;
  if (!token) {
    return null;
  }

  return parseVendorSessionToken(token);
}

export async function setVendorSession(payload: VendorSessionPayload) {
  const cookieStore = await cookies();

  cookieStore.set(vendorSessionCookieName, createVendorSessionToken(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: vendorSessionMaxAgeSeconds,
  });
}

export async function clearVendorSession() {
  const cookieStore = await cookies();

  cookieStore.set(vendorSessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
