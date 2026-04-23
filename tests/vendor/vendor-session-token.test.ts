import { describe, expect, it } from "vitest";

import {
  createVendorSessionToken,
  parseVendorSessionToken,
} from "../../features/vendor/server/session-token";

describe("vendor session token", () => {
  it("round-trips a token payload", () => {
    const token = createVendorSessionToken({
      vendorId: "4db95ac0-b5af-4fe6-a318-818b1307ed87",
      username: "apollo",
      displayName: "Apollo International Desk",
    });

    const parsed = parseVendorSessionToken(token);

    expect(parsed).toEqual({
      vendorId: "4db95ac0-b5af-4fe6-a318-818b1307ed87",
      username: "apollo",
      displayName: "Apollo International Desk",
    });
  });

  it("returns null for malformed tokens", () => {
    expect(parseVendorSessionToken("bad-token")).toBeNull();
  });
});
