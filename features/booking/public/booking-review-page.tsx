import type { RouteSearchParams } from "@/lib/route-search";

import type { LoadedBookingReview } from "../server/booking-model";
import { confirmBookingAction } from "../server/confirm-booking-action";
import { loadBookingReview } from "../server/load-booking-review";
import {
  getBookingErrorMessage,
  parseBookingSearchParams,
  readBookingPageError,
} from "../types/contracts";
import { BookingPageFrame } from "../ui/booking-page-frame";
import {
  BookingReviewActionForm,
  BookingReviewHero,
  BookingReviewSupportStrip,
  SelectedTreatmentPanel,
  TrialPatientProfilePanel,
} from "../ui/booking-sections";
import { BookingStatePanel } from "../ui/booking-state-panel";

type BookingReviewPageProps = Readonly<{
  searchParams: RouteSearchParams;
}>;

export async function BookingReviewPage({ searchParams }: BookingReviewPageProps) {
  const parsedSelection = parseBookingSearchParams(searchParams);
  if (!parsedSelection.success) {
    return (
      <BookingPageFrame>
        <BookingStatePanel
          eyebrow="Booking Request Missing"
          title="We need a valid hospital, doctor, and room choice before we can confirm."
          body="Please return to search, choose a treatment option again, and come back through the Book Now button."
        />
      </BookingPageFrame>
    );
  }

  const state = await loadBookingReview(parsedSelection.data);
  return renderBookingReviewState(state, readBookingPageError(searchParams.error));
}

function renderBookingReviewState(
  state: Awaited<ReturnType<typeof loadBookingReview>>,
  errorCode: ReturnType<typeof readBookingPageError>,
) {
  if (state.kind === "invalid_selection") {
    return (
      <BookingPageFrame>
        <BookingStatePanel
          eyebrow="Selection Changed"
          title="That treatment combination is no longer available."
          body="The final quote is always validated on the server before booking. Please go back and pick another doctor or room type."
        />
      </BookingPageFrame>
    );
  }

  if (state.kind === "unconfigured") {
    return (
      <BookingPageFrame>
        <BookingStatePanel
          eyebrow="Backend Setup Needed"
          title="Supabase is not configured for booking yet."
          body={`Missing: ${state.missingKeys.join(", ")}`}
        />
      </BookingPageFrame>
    );
  }

  if (state.kind === "error") {
    return (
      <BookingPageFrame>
        <BookingStatePanel
          eyebrow="Temporary Issue"
          title="We could not load the booking review."
          body={state.message}
        />
      </BookingPageFrame>
    );
  }

  return <BookingReviewContent review={state.review} errorCode={errorCode} />;
}

function BookingReviewContent({
  review,
  errorCode,
}: Readonly<{
  review: LoadedBookingReview;
  errorCode: ReturnType<typeof readBookingPageError>;
}>) {
  return (
    <BookingPageFrame>
      <BookingReviewHero />
      {errorCode ? (
        <BookingStatePanel
          eyebrow="Booking Could Not Be Completed"
          title="The booking was not confirmed."
          body={getBookingErrorMessage(errorCode)}
        />
      ) : null}
      <section className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7">
          <SelectedTreatmentPanel review={review} />
        </div>
        <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-8">
          <TrialPatientProfilePanel review={review} />
          <BookingReviewActionForm review={review} confirmBookingAction={confirmBookingAction} />
        </div>
      </section>
      <BookingReviewSupportStrip />
    </BookingPageFrame>
  );
}
