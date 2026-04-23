import { cookies } from "next/headers";
import { z } from "zod";

import { shouldUseSecureCookie } from "../../../lib/cookie-security";
import { getRogvedaSessionSecret } from "../../../lib/env";
import { createSignedToken, parseSignedToken } from "../../../lib/signed-token";

const bookingConfirmationCookieName = "rogveda_booking_confirmation";
const bookingConfirmationMaxAgeSeconds = 60 * 60;

const bookingConfirmationTokenSchema = z.object({
  bookingId: z.string().uuid(),
  iat: z.number().int().nonnegative(),
  exp: z.number().int().nonnegative(),
});

export type BookingConfirmationAccessState =
  | {
      kind: "authorized";
    }
  | {
      kind: "unauthorized";
    }
  | {
      kind: "unconfigured";
      missingKeys: ["ROGVEDA_SESSION_SECRET"];
    };

export function createBookingConfirmationAccessToken(
  bookingId: string,
  options: Readonly<{
    secret: string;
    expiresInSeconds?: number;
    nowMs?: () => number;
  }>,
) {
  return createSignedToken(
    { bookingId },
    {
      secret: options.secret,
      expiresInSeconds: options.expiresInSeconds ?? bookingConfirmationMaxAgeSeconds,
      nowMs: options.nowMs,
    },
  );
}

export function canAccessBookingConfirmation(
  token: string | null | undefined,
  bookingId: string,
  options: Readonly<{
    secret: string;
    nowMs?: () => number;
  }>,
) {
  if (!token) {
    return false;
  }

  const parsed = parseSignedToken(token, {
    secret: options.secret,
    schema: bookingConfirmationTokenSchema,
    nowMs: options.nowMs,
  });

  return parsed?.bookingId === bookingId;
}

export async function grantBookingConfirmationAccess(bookingId: string) {
  const secret = getRogvedaSessionSecret();
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const secure = await shouldUseSecureCookie();
  cookieStore.set(
    bookingConfirmationCookieName,
    createBookingConfirmationAccessToken(bookingId, { secret }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/booking/confirmation",
      maxAge: bookingConfirmationMaxAgeSeconds,
    },
  );

  return true;
}

export async function readBookingConfirmationAccess(bookingId: string) {
  const secret = getRogvedaSessionSecret();
  if (!secret) {
    return {
      kind: "unconfigured",
      missingKeys: ["ROGVEDA_SESSION_SECRET"],
    } satisfies BookingConfirmationAccessState;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(bookingConfirmationCookieName)?.value;

  return canAccessBookingConfirmation(token, bookingId, { secret })
    ? ({ kind: "authorized" } satisfies BookingConfirmationAccessState)
    : ({ kind: "unauthorized" } satisfies BookingConfirmationAccessState);
}
