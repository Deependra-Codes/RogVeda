import { describe, expect, it } from "vitest";

import {
  createVendorSessionToken,
  parseVendorSessionToken,
} from "../../features/vendor/server/session-token";

const sessionSecret = "test-session-secret";

describe("vendor session token", () => {
  it("round-trips a token payload", () => {
    const token = createVendorSessionToken(
      {
        vendorId: "4db95ac0-b5af-4fe6-a318-818b1307ed87",
        username: "apollo",
        displayName: "Apollo International Desk",
      },
      {
        secret: sessionSecret,
        expiresInSeconds: 60,
        nowMs: () => 1_000,
      },
    );

    const parsed = parseVendorSessionToken(token, {
      secret: sessionSecret,
      nowMs: () => 20_000,
    });

    expect(parsed).toEqual({
      vendorId: "4db95ac0-b5af-4fe6-a318-818b1307ed87",
      username: "apollo",
      displayName: "Apollo International Desk",
    });
  });

  it("returns null for malformed tokens", () => {
    expect(
      parseVendorSessionToken("bad-token", {
        secret: sessionSecret,
      }),
    ).toBeNull();
  });

  it("rejects expired or tampered tokens", () => {
    const token = createVendorSessionToken(
      {
        vendorId: "4db95ac0-b5af-4fe6-a318-818b1307ed87",
        username: "apollo",
        displayName: "Apollo International Desk",
      },
      {
        secret: sessionSecret,
        expiresInSeconds: 10,
        nowMs: () => 1_000,
      },
    );

    expect(
      parseVendorSessionToken(token, {
        secret: sessionSecret,
        nowMs: () => 20_000,
      }),
    ).toBeNull();

    expect(
      parseVendorSessionToken(`${token}tampered`, {
        secret: sessionSecret,
        nowMs: () => 5_000,
      }),
    ).toBeNull();
  });
});
