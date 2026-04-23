import { describe, expect, it } from "vitest";

import { formatMoneyFromUsdCents } from "../../lib/currency";

describe("currency formatting", () => {
  it("keeps the search and booking displays aligned across supported currencies", () => {
    expect(formatMoneyFromUsdCents(320000, "USD")).toBe("$3,200");
    expect(formatMoneyFromUsdCents(320000, "INR")).toBe("₹2,65,600");
    expect(formatMoneyFromUsdCents(320000, "NGN")).toBe("₦4,960,000");
  });

  it("preserves the negative wallet display used on booking confirmation", () => {
    expect(formatMoneyFromUsdCents(-320000, "INR")).toBe("-₹2,65,600");
    expect(formatMoneyFromUsdCents(-320000, "USD")).toBe("-$3,200");
  });
});
