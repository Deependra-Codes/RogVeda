export const currencyOptions = ["USD", "INR", "NGN"] as const;

const currencyMeta = {
  USD: { code: "USD", locale: "en-US", rateFromUsd: 1 },
  INR: { code: "INR", locale: "en-IN", rateFromUsd: 83 },
  NGN: { code: "NGN", locale: "en-NG", rateFromUsd: 1550 },
} as const;

export type CurrencyCode = (typeof currencyOptions)[number];

export function convertUsdCents(amountUsdCents: number, currency: CurrencyCode) {
  if (currency === "USD") {
    return amountUsdCents / 100;
  }

  return Math.round((amountUsdCents / 100) * currencyMeta[currency].rateFromUsd);
}

export function formatMoneyFromUsdCents(amountUsdCents: number, currency: CurrencyCode) {
  const fractionDigits = currency === "USD" && amountUsdCents % 100 !== 0 ? 2 : 0;

  return new Intl.NumberFormat(currencyMeta[currency].locale, {
    style: "currency",
    currency: currencyMeta[currency].code,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(convertUsdCents(amountUsdCents, currency));
}

export function formatConversionHint() {
  return "1 USD = 83 INR = 1,550 NGN";
}
