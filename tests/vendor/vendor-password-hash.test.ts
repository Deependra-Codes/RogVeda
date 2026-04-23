import { describe, expect, it } from "vitest";

import {
  hashVendorPassword,
  verifyVendorPassword,
} from "../../features/vendor/server/password-hash";

describe("vendor password hash", () => {
  it("verifies a password against a stored scrypt hash", () => {
    const storedHash = hashVendorPassword("apollo123", "abf3e45870dfae49433a0ac7b4aeac53");

    expect(verifyVendorPassword("apollo123", storedHash)).toBe(true);
    expect(verifyVendorPassword("wrong-password", storedHash)).toBe(false);
  });

  it("rejects malformed hashes safely", () => {
    expect(verifyVendorPassword("apollo123", "bad-hash")).toBe(false);
  });
});
