import Link from "next/link";

import { formatMoneyFromUsdCents } from "@/lib/currency";

import type { LoadedBookingConfirmation } from "../server/booking-model";
import { BookingDetailBlock } from "./booking-detail-block";

type BookingConfirmationDetailsProps = Readonly<{
  confirmation: LoadedBookingConfirmation;
  currency: "USD" | "INR" | "NGN";
}>;

export function BookingConfirmationHero({
  confirmation,
  currency,
}: BookingConfirmationDetailsProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-accent/15 bg-accent-soft/46 p-6 sm:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.12),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent_45%)]" />
      <div className="relative">
        <div className="status-chip-success mb-4">Confirmed</div>
        <p className="type-label text-accent/70">Booking Confirmed</p>
        <h1 className="mt-3 type-heading-xl max-w-[16ch] text-ink">
          Your booking is saved and the coordination workflow can begin.
        </h1>
        <p className="mt-4 max-w-[58ch] type-body-m text-ink/68">
          This page is proof, not theatre: the booking record exists, the wallet balance is updated,
          and the first vendor task is already attached to the same saved booking.
        </p>

        <div className="mt-6 grid gap-4 border-t border-accent/12 pt-6 sm:grid-cols-3">
          <HeroMetric label="Booking ID" value={confirmation.bookingId} mono />
          <HeroMetric label="Hospital" value={confirmation.hospitalName} />
          <HeroMetric
            label={`Confirmed Price (${currency})`}
            value={formatMoneyFromUsdCents(confirmation.amountUsdCents, currency)}
          />
        </div>
      </div>
    </section>
  );
}

export function BookingConfirmationDetails({
  confirmation,
  currency,
}: BookingConfirmationDetailsProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <ConfirmationDetailPanel confirmation={confirmation} currency={currency} />
        <ConfirmationActions />
      </div>

      <div className="space-y-6 lg:col-span-4">
        <ConfirmationChangePanel confirmation={confirmation} currency={currency} />
        <ConfirmationWorkflowPanel />
      </div>
    </div>
  );
}

function ConfirmationDetailPanel({ confirmation, currency }: BookingConfirmationDetailsProps) {
  return (
    <section className="panel-soft p-6 sm:p-8">
      <div className="border-b border-border pb-4">
        <p className="type-label text-ink/45">Saved Details</p>
        <p className="mt-3 type-body-s text-ink/62">
          The booking record below is the same one the vendor route reads for operational follow-up.
        </p>
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <BookingDetailBlock label="Booking ID" value={confirmation.bookingId} mono />
        <BookingDetailBlock label="Status" value={confirmation.bookingStatus} />
        <BookingDetailBlock label="Procedure" value={confirmation.procedureName} />
        <BookingDetailBlock label="Doctor" value={confirmation.doctorName} />
        <BookingDetailBlock label="Room Type" value={confirmation.roomType} />
        <BookingDetailBlock
          label={`Confirmed Price (${currency})`}
          value={formatMoneyFromUsdCents(confirmation.amountUsdCents, currency)}
          emphasis
        />
        <BookingDetailBlock label="Hospital" value={confirmation.hospitalName} />
        <BookingDetailBlock
          label="Patient"
          value={`${confirmation.patientName} / ${confirmation.patientEmail}`}
        />
      </div>
    </section>
  );
}

function ConfirmationChangePanel({ confirmation, currency }: BookingConfirmationDetailsProps) {
  return (
    <section className="panel-soft p-6 sm:p-7">
      <div className="border-b border-border pb-4">
        <p className="type-label text-ink/45">What Changed</p>
        <h2 className="mt-3 type-heading-l text-ink">
          The booking now has an operational next step.
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        <ChangeRow
          label={`Updated Wallet (${currency})`}
          value={formatMoneyFromUsdCents(confirmation.walletBalanceUsdCents, currency)}
          emphasize
        />
        <ChangeRow label="Vendor Task" value={confirmation.taskTitle} />
        <ChangeRow label="Task Status" value={confirmation.taskStatus} />
        <ChangeRow label="Booking Status" value={confirmation.bookingStatus} />
      </div>
    </section>
  );
}

function ConfirmationWorkflowPanel() {
  return (
    <section className="panel-operational p-6 sm:p-7">
      <p className="type-label text-ink/45">Connected Demo Flow</p>
      <div className="mt-5 space-y-5">
        <WorkflowStep
          step="01"
          title="Booking saved"
          body="The patient-side confirmation wrote the booking and wallet transaction together."
        />
        <WorkflowStep
          step="02"
          title="Vendor task created"
          body="The first travel coordination task is already attached to that saved record."
        />
        <WorkflowStep
          step="03"
          title="Operations can continue"
          body="The vendor route can now mark the task complete and move the booking to In Progress."
        />
      </div>
    </section>
  );
}

function ConfirmationActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link href="/" className="btn-secondary w-full text-center leading-[3rem]">
        Back To Search
      </Link>
      <Link href="/vendor/login" className="btn-primary w-full text-center leading-[3rem]">
        Open Vendor Login
      </Link>
    </div>
  );
}

function HeroMetric({
  label,
  value,
  mono,
}: Readonly<{ label: string; value: string; mono?: boolean }>) {
  return (
    <div className="rounded-control border border-accent/12 bg-paper/60 px-4 py-4">
      <p className="type-label text-ink/40">{label}</p>
      <p
        className={`mt-2 break-words text-[15px] leading-6 text-ink ${
          mono ? "font-mono text-[13px] tracking-wide" : "font-semibold"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ChangeRow({
  label,
  value,
  emphasize,
}: Readonly<{ label: string; value: string; emphasize?: boolean }>) {
  return (
    <div className="rounded-control border border-border/80 bg-bg/38 px-4 py-3">
      <p className="type-label text-ink/38">{label}</p>
      <p
        className={`mt-2 break-words text-[15px] leading-6 ${
          emphasize ? "font-bold tabular-nums text-ink" : "font-semibold text-ink/86"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  body,
}: Readonly<{ step: string; title: string; body: string }>) {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-paper text-[12px] font-bold tracking-[0.12em] text-ink/60">
        {step}
      </div>
      <div>
        <p className="text-[15px] font-semibold leading-6 text-ink">{title}</p>
        <p className="mt-1 type-body-s text-ink/62">{body}</p>
      </div>
    </div>
  );
}
