import { describe, expect, it } from "vitest";

import { resolveSecureCookieSetting } from "../../lib/cookie-security";

describe("secure cookie setting", () => {
  it("uses secure cookies when forwarded protocol is https", () => {
    expect(
      resolveSecureCookieSetting({
        forwardedProto: "https",
        host: "project-feiuh.vercel.app",
        nodeEnv: "production",
      }),
    ).toBe(true);
  });

  it("keeps local production-start smoke tests on non-secure cookies over localhost http", () => {
    expect(
      resolveSecureCookieSetting({
        host: "127.0.0.1:3200",
        nodeEnv: "production",
      }),
    ).toBe(false);
  });

  it("falls back to secure cookies for non-local production hosts without proxy headers", () => {
    expect(
      resolveSecureCookieSetting({
        host: "example.com",
        nodeEnv: "production",
      }),
    ).toBe(true);
  });
});
