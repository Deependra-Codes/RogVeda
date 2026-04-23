import { z } from "zod";

import { currencyOptions } from "@/lib/currency";
import {
  type RouteSearchParamValue,
  type RouteSearchParams,
  firstRouteSearchValue,
} from "@/lib/route-search";

const roomTypeValues = ["General Ward", "Semi-Private", "Private", "Suite"] as const;
const bookingErrorValues = [
  "invalid_request",
  "invalid_selection",
  "booking_failed",
  "service_unavailable",
] as const;

export const demoPatientProfile = {
  fullName: "Amina Okafor",
  email: "amina@example.com",
} as const;

export const roomTypeSchema = z.enum(roomTypeValues);
export const currencyCodeSchema = z.enum(currencyOptions);
export const bookingPageErrorSchema = z.enum(bookingErrorValues);

export const bookingSearchParamsSchema = z.object({
  hospitalId: z.string().uuid(),
  doctorId: z.string().uuid(),
  roomType: roomTypeSchema,
  currency: currencyCodeSchema,
});

export const confirmBookingPayloadSchema = bookingSearchParamsSchema.extend({
  patientName: z.string().trim().min(1),
  patientEmail: z.string().trim().email(),
});

export type BookingSelection = z.infer<typeof bookingSearchParamsSchema>;
export type ConfirmBookingPayload = z.infer<typeof confirmBookingPayloadSchema>;
export type BookingPageError = z.infer<typeof bookingPageErrorSchema>;

export function parseBookingSearchParams(searchParams: RouteSearchParams) {
  return bookingSearchParamsSchema.safeParse({
    hospitalId: firstRouteSearchValue(searchParams.hospitalId),
    doctorId: firstRouteSearchValue(searchParams.doctorId),
    roomType: firstRouteSearchValue(searchParams.roomType),
    currency: firstRouteSearchValue(searchParams.currency),
  });
}

export function parseConfirmBookingPayload(formData: FormData) {
  return confirmBookingPayloadSchema.safeParse(Object.fromEntries(formData));
}

export function readBookingPageError(rawValue: RouteSearchParamValue) {
  return bookingPageErrorSchema.safeParse(firstRouteSearchValue(rawValue)).data ?? null;
}

export function readCurrencyCode(rawValue: RouteSearchParamValue) {
  return currencyCodeSchema.safeParse(firstRouteSearchValue(rawValue)).data ?? "USD";
}

export function getBookingErrorMessage(errorCode: BookingPageError) {
  const messages: Record<BookingPageError, string> = {
    invalid_request:
      "The booking request is missing required details. Please start again from search.",
    invalid_selection:
      "That doctor and room combination is no longer valid. Please pick another option from the search page.",
    booking_failed:
      "We could not confirm the booking right now. Your wallet and booking records were not changed.",
    service_unavailable:
      "The booking service is temporarily unavailable. Please try again in a moment.",
  };

  return messages[errorCode];
}

export function buildBookingRoute(selection: BookingSelection, errorCode?: BookingPageError) {
  const params = new URLSearchParams({
    hospitalId: selection.hospitalId,
    doctorId: selection.doctorId,
    roomType: selection.roomType,
    currency: selection.currency,
  });

  if (errorCode) {
    params.set("error", errorCode);
  }

  return `/booking?${params.toString()}`;
}

export function buildBookingConfirmationRoute(
  bookingId: string,
  currency: BookingSelection["currency"],
) {
  const params = new URLSearchParams({ currency });
  return `/booking/confirmation/${bookingId}?${params.toString()}`;
}
