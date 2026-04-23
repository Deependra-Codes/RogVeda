import { z } from "zod";

const vendorSessionPayloadSchema = z.object({
  vendorId: z.string().uuid(),
  username: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
});

export type VendorSessionPayload = z.infer<typeof vendorSessionPayloadSchema>;

export function createVendorSessionToken(payload: VendorSessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function parseVendorSessionToken(token: string) {
  if (!token.trim()) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    return vendorSessionPayloadSchema.safeParse(JSON.parse(decoded)).data ?? null;
  } catch {
    return null;
  }
}
