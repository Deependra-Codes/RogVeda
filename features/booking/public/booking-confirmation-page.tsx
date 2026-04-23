import type { RouteSearchParams } from "@/lib/route-search";

import { loadBookingConfirmation } from "../server/load-booking-confirmation";
import { readCurrencyCode } from "../types/contracts";
import { BookingPageFrame } from "../ui/booking-page-frame";
import { BookingConfirmationDetails, BookingConfirmationHero } from "../ui/booking-sections";
import { BookingStatePanel } from "../ui/booking-state-panel";

type BookingConfirmationPageProps = Readonly<{
  bookingId: string;
  searchParams: RouteSearchParams;
}>;

export async function BookingConfirmationPage({
  bookingId,
  searchParams,
}: BookingConfirmationPageProps) {
  const state = await loadBookingConfirmation(bookingId);
  const currency = readCurrencyCode(searchParams.currency);

  if (state.kind === "not_found") {
    return (
      <BookingPageFrame>
        <BookingStatePanel
          title="Booking not found."
          body="We could not find that booking record."
        />
      </BookingPageFrame>
    );
  }

  if (state.kind === "unauthorized") {
    return (
      <BookingPageFrame>
        <BookingStatePanel
          title="Confirmation access expired."
          body="This confirmation can only be opened in the same browser that completed the booking. Please confirm again from search if you still need the record."
        />
      </BookingPageFrame>
    );
  }

  if (state.kind === "unconfigured") {
    return (
      <BookingPageFrame>
        <BookingStatePanel
          title="Supabase is not configured for confirmation."
          body={`Missing: ${state.missingKeys.join(", ")}`}
        />
      </BookingPageFrame>
    );
  }

  if (state.kind === "error") {
    return (
      <BookingPageFrame>
        <BookingStatePanel title="Confirmation could not be loaded." body={state.message} />
      </BookingPageFrame>
    );
  }

  return (
    <BookingPageFrame>
      <BookingConfirmationHero confirmation={state.confirmation} currency={currency} />
      <BookingConfirmationDetails confirmation={state.confirmation} currency={currency} />
    </BookingPageFrame>
  );
}
