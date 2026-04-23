import { createHmac, timingSafeEqual } from "node:crypto";

import type { ZodType } from "zod";

type SignedTokenOptions = Readonly<{
  secret: string;
  expiresInSeconds: number;
  nowMs?: () => number;
}>;

type ParseSignedTokenOptions<T extends { exp: number }> = Readonly<{
  secret: string;
  schema: ZodType<T>;
  nowMs?: () => number;
}>;

export function createSignedToken<T extends Record<string, unknown>>(
  payload: T,
  options: SignedTokenOptions,
) {
  const issuedAt = resolveEpochSeconds(options.nowMs);
  const claims = {
    ...payload,
    iat: issuedAt,
    exp: issuedAt + options.expiresInSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  const signature = signPayload(encodedPayload, options.secret);

  return `${encodedPayload}.${signature}`;
}

export function parseSignedToken<T extends { exp: number }>(
  token: string,
  options: ParseSignedTokenOptions<T>,
) {
  if (!token.trim()) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, options.secret);
  if (!safeEquals(signature, expectedSignature)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    const parsed = options.schema.safeParse(decoded);
    if (!parsed.success) {
      return null;
    }

    const nowSeconds = resolveEpochSeconds(options.nowMs);
    if (parsed.data.exp <= nowSeconds) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function resolveEpochSeconds(nowMs?: () => number) {
  return Math.floor((nowMs?.() ?? Date.now()) / 1000);
}
