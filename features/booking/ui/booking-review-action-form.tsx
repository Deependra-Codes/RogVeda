import Link from "next/link";

import { formatMoneyFromUsdCents } from "@/lib/currency";

import type { LoadedBookingReview } from "../server/booking-model";

type BookingReviewActionFormProps = Readonly<{
  review: LoadedBookingReview;
  confirmBookingAction: (formData: FormData) => Promise<void>;
}>;

export function BookingReviewActionForm({
  review,
  confirmBookingAction,
}: BookingReviewActionFormProps) {
  const projectedWalletUsdCents = review.patient.walletBalanceUsdCents - review.amountUsdCents;

  return (
    <form action={confirmBookingAction} className="panel-soft border-accent/15 p-6 sm:p-7">
      <BookingReviewHiddenFields review={review} />

      <p className="type-label text-accent/70">Confirm Booking</p>
      <h3 className="mt-3 text-[24px] font-semibold leading-[30px] tracking-tight text-ink">
        See the wallet movement before anything is written.
      </h3>
      <p className="mt-3 type-body-s text-ink/62">
        The action below writes the booking, wallet transaction, and vendor task together after the
        server confirms the selected combination is still valid.
      </p>

      <BookingWalletSummary review={review} projectedWalletUsdCents={projectedWalletUsdCents} />
      <BookingImpactNote />
      <BookingActionFooter />
    </form>
  );
}

function BookingReviewHiddenFields({ review }: Readonly<{ review: LoadedBookingReview }>) {
  return (
    <>
      <input type="hidden" name="patientName" value={review.patient.fullName} />
      <input type="hidden" name="patientEmail" value={review.patient.email} />
      <input type="hidden" name="hospitalId" value={review.selection.hospitalId} />
      <input type="hidden" name="doctorId" value={review.selection.doctorId} />
      <input type="hidden" name="roomType" value={review.selection.roomType} />
      <input type="hidden" name="currency" value={review.selection.currency} />
    </>
  );
}

function BookingWalletSummary({
  review,
  projectedWalletUsdCents,
}: Readonly<{ review: LoadedBookingReview; projectedWalletUsdCents: number }>) {
  return (
    <div className="mt-5 space-y-2 rounded-[22px] border border-border bg-bg/46 px-5 py-4">
      <WalletRow
        label="Wallet before"
        value={formatMoneyFromUsdCents(
          review.patient.walletBalanceUsdCents,
          review.selection.currency,
        )}
      />
      <WalletRow
        label="Booking amount"
        value={formatMoneyFromUsdCents(review.amountUsdCents, review.selection.currency)}
      />
      <div className="border-t border-border pt-2">
        <WalletRow
          label="Wallet after confirmation"
          value={formatMoneyFromUsdCents(projectedWalletUsdCents, review.selection.currency)}
          bold
        />
      </div>
    </div>
  );
}

function BookingImpactNote() {
  return (
    <div className="mt-5 rounded-control border border-warm/18 bg-warm/[0.06] px-4 py-3">
      <p className="type-body-s font-semibold text-warm">
        Negative wallet balances are allowed in this demo.
      </p>
      <p className="mt-1 type-body-s text-ink/62">
        The balance can move below zero, but it is always shown clearly before and after the action.
      </p>
    </div>
  );
}

function BookingActionFooter() {
  return (
    <div className="sticky bottom-4 mt-6 rounded-[24px] bg-paper/90 p-3 shadow-elevated backdrop-blur-md sm:static sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
      <div className="flex flex-col gap-3">
        <button type="submit" className="btn-primary w-full">
          Confirm Booking
        </button>
        <Link href="/" className="btn-secondary w-full text-center leading-[3rem]">
          Back To Search
        </Link>
      </div>
    </div>
  );
}

function WalletRow({
  label,
  value,
  bold,
}: Readonly<{ label: string; value: string; bold?: boolean }>) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`type-body-s ${bold ? "font-semibold text-ink" : "text-ink/60"}`}>
        {label}
      </span>
      <span
        className={`type-body-s tabular-nums ${
          bold ? "font-bold text-ink" : "font-medium text-ink/75"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
