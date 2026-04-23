import { describe, expect, it } from "vitest";

import {
  canAccessBookingConfirmation,
  createBookingConfirmationAccessToken,
} from "../../features/booking/server/confirmation-access";

const bookingId = "4db95ac0-b5af-4fe6-a318-818b1307ed87";
const sessionSecret = "test-session-secret";

describe("booking confirmation access", () => {
  it("authorizes the matching booking when the token is valid", () => {
    const token = createBookingConfirmationAccessToken(bookingId, {
      secret: sessionSecret,
      expiresInSeconds: 60,
      nowMs: () => 1_000,
    });

    expect(
      canAccessBookingConfirmation(token, bookingId, {
        secret: sessionSecret,
        nowMs: () => 20_000,
      }),
    ).toBe(true);
  });

  it("rejects access without a valid token", () => {
    const token = createBookingConfirmationAccessToken(bookingId, {
      secret: sessionSecret,
      expiresInSeconds: 60,
      nowMs: () => 1_000,
    });

    expect(
      canAccessBookingConfirmation(null, bookingId, {
        secret: sessionSecret,
      }),
    ).toBe(false);

    expect(
      canAccessBookingConfirmation(token, "5db95ac0-b5af-4fe6-a318-818b1307ed87", {
        secret: sessionSecret,
        nowMs: () => 20_000,
      }),
    ).toBe(false);

    expect(
      canAccessBookingConfirmation(token, bookingId, {
        secret: "wrong-secret",
        nowMs: () => 20_000,
      }),
    ).toBe(false);

    expect(
      canAccessBookingConfirmation(token, bookingId, {
        secret: sessionSecret,
        nowMs: () => 90_000,
      }),
    ).toBe(false);
  });
});
