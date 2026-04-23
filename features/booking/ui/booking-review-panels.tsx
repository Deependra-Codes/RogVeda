import { formatMoneyFromUsdCents } from "@/lib/currency";

import type { LoadedBookingReview } from "../server/booking-model";
import { BookingDetailBlock } from "./booking-detail-block";

export function SelectedTreatmentPanel({ review }: Readonly<{ review: LoadedBookingReview }>) {
  return (
    <section className="panel-soft overflow-hidden p-0">
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="p-6 sm:p-8 lg:border-r lg:border-border">
          <p className="type-label text-ink/45">Selected Treatment</p>
          <h2 className="mt-3 text-[28px] font-semibold leading-[34px] tracking-tight text-ink">
            {review.hospital.name}
          </h2>
          <p className="mt-2 type-body-m text-ink/68">
            {review.procedureName} in {review.hospital.city}, with travel-ready support visible
            before you commit.
          </p>

          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <BookingDetailBlock
              label="Hospital"
              value={`${review.hospital.name}, ${review.hospital.city}`}
            />
            <BookingDetailBlock label="Location" value={review.hospital.locationLabel} />
            <BookingDetailBlock label="Procedure" value={review.procedureName} />
            <BookingDetailBlock
              label="Doctor"
              value={`${review.doctor.name} / ${review.doctor.yearsExperience} yrs`}
            />
            <BookingDetailBlock label="Room Type" value={review.roomType} />
            <BookingDetailBlock
              label={`Estimated Price (${review.selection.currency})`}
              value={formatMoneyFromUsdCents(review.amountUsdCents, review.selection.currency)}
              emphasis
            />
          </div>
        </div>

        <div className="bg-bg/38 p-6 sm:p-8">
          <p className="type-label text-ink/45">Package Snapshot</p>
          <div className="mt-5 space-y-4">
            <SnapshotRow label="Region" value={review.hospital.locationLabel} />
            <SnapshotRow label="Surgeon" value={review.doctor.name} />
            <SnapshotRow label="Experience" value={`${review.doctor.yearsExperience} years`} />
            <SnapshotRow label="Room" value={review.roomType} />
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <p className="type-label text-ink/40">Transparent Estimate</p>
            <p className="mt-2 text-[32px] font-bold tracking-tight text-ink">
              {formatMoneyFromUsdCents(review.amountUsdCents, review.selection.currency)}
            </p>
            <p className="mt-2 type-body-s text-ink/60">
              Revalidated on the server again at confirmation time before the booking, wallet entry,
              and vendor task are saved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrialPatientProfilePanel({ review }: Readonly<{ review: LoadedBookingReview }>) {
  return (
    <section className="panel-soft p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="type-label text-ink/45">Patient And Wallet</p>
          <p className="mt-2 type-body-s text-ink/60">
            Trial identity is intentionally light, but the balance and booking consequence stay
            explicit.
          </p>
        </div>
        <span className="status-chip-accent">Ready</span>
      </div>

      <div className="mt-5 space-y-4">
        <BookingDetailBlock label="Name" value={review.patient.fullName} />
        <BookingDetailBlock label="Email" value={review.patient.email} />
        <BookingDetailBlock
          label={`Wallet Balance (${review.selection.currency})`}
          value={formatMoneyFromUsdCents(
            review.patient.walletBalanceUsdCents,
            review.selection.currency,
          )}
          emphasis
        />
      </div>
    </section>
  );
}

function SnapshotRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
      <span className="type-body-s text-ink/58">{label}</span>
      <span className="text-right text-[14px] font-semibold leading-5 text-ink">{value}</span>
    </div>
  );
}
