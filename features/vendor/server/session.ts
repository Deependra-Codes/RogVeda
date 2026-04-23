import { cookies } from "next/headers";

import { shouldUseSecureCookie } from "@/lib/cookie-security";
import { getRogvedaSessionSecret } from "@/lib/env";

import {
  type VendorSessionPayload,
  createVendorSessionToken,
  parseVendorSessionToken,
} from "./session-token";

export const vendorSessionCookieName = "rogveda_vendor_session";
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
  const secure = await shouldUseSecureCookie();
  const cookie = createVendorSessionCookie(payload, secure);
  if (!cookie) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(cookie.name, cookie.value, cookie.options);

  return true;
}

export async function clearVendorSession() {
  const cookieStore = await cookies();
  const secure = await shouldUseSecureCookie();
  const cookie = createClearedVendorSessionCookie(secure);

  cookieStore.set(cookie.name, cookie.value, cookie.options);
}

export function createVendorSessionCookie(payload: VendorSessionPayload, secure: boolean) {
  const secret = getRogvedaSessionSecret();
  if (!secret) {
    return null;
  }

  return {
    name: vendorSessionCookieName,
    value: createVendorSessionToken(payload, {
      secret,
      expiresInSeconds: vendorSessionMaxAgeSeconds,
    }),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure,
      path: "/",
      maxAge: vendorSessionMaxAgeSeconds,
    },
  };
}

export function createClearedVendorSessionCookie(secure: boolean) {
  return {
    name: vendorSessionCookieName,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure,
      path: "/",
      maxAge: 0,
    },
  };
}
