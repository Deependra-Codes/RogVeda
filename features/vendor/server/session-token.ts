import { z } from "zod";

import { createSignedToken, parseSignedToken } from "../../../lib/signed-token";

const vendorSessionPayloadSchema = z.object({
  vendorId: z.string().uuid(),
  username: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
});

const vendorSessionTokenSchema = vendorSessionPayloadSchema.extend({
  iat: z.number().int().nonnegative(),
  exp: z.number().int().nonnegative(),
});

export type VendorSessionPayload = z.infer<typeof vendorSessionPayloadSchema>;

export function createVendorSessionToken(
  payload: VendorSessionPayload,
  options: Readonly<{
    secret: string;
    expiresInSeconds: number;
    nowMs?: () => number;
  }>,
) {
  return createSignedToken(payload, options);
}

export function parseVendorSessionToken(
  token: string,
  options: Readonly<{
    secret: string;
    nowMs?: () => number;
  }>,
) {
  const parsed = parseSignedToken(token, {
    secret: options.secret,
    schema: vendorSessionTokenSchema,
    nowMs: options.nowMs,
  });

  if (!parsed) {
    return null;
  }

  return vendorSessionPayloadSchema.parse(parsed);
}
