import { cookies } from "next/headers";

import { getRogvedaSessionSecret } from "@/lib/env";

import {
  type VendorSessionPayload,
  createVendorSessionToken,
  parseVendorSessionToken,
} from "./session-token";

const vendorSessionCookieName = "rogveda_vendor_session";
const vendorSessionMaxAgeSeconds = 60 * 60 * 12;

export async function readVendorSession() {
  const secret = getRogvedaSessionSecret();
  if (!secret) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(vendorSessionCookieName)?.value;
  if (!token) {
    return null;
  }

  return parseVendorSessionToken(token, { secret });
}

export async function setVendorSession(payload: VendorSessionPayload) {
  const secret = getRogvedaSessionSecret();
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();

  cookieStore.set(
    vendorSessionCookieName,
    createVendorSessionToken(payload, {
      secret,
      expiresInSeconds: vendorSessionMaxAgeSeconds,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: vendorSessionMaxAgeSeconds,
    },
  );

  return true;
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
