import { formatMoneyFromUsdCents } from "@/lib/currency";

import type { VendorDashboardBooking } from "../server/dashboard-model";

type VendorFocusPanelProps = Readonly<{
  booking?: VendorDashboardBooking;
}>;

type VendorQueueIntroProps = Readonly<{
  bookingCount: number;
  pendingTaskCount: number;
}>;

export function VendorFocusPanel({ booking }: VendorFocusPanelProps) {
  if (!booking) {
    return (
      <section className="panel-operational p-6">
        <p className="type-label text-ink/45">Queue Focus</p>
        <p className="mt-3 type-body-s text-ink/62">
          Once a patient confirms a booking, the first task and booking summary will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="panel-operational p-6 sm:p-7">
      <p className="type-label text-ink/45">Next Booking In Focus</p>
      <h2 className="mt-3 type-heading-l text-ink">{booking.patientName}</h2>
      <p className="mt-2 type-body-s text-ink/62">
        {booking.procedureName} at {booking.hospitalName}, {booking.hospitalCity}
      </p>

      <div className="mt-5 space-y-3">
        <FocusRow label="Booking ID" value={booking.bookingId} mono />
        <FocusRow label="Task" value={booking.taskTitle} />
        <FocusRow label="Task Status" value={booking.taskStatus} />
        <FocusRow
          label="Price"
          value={formatMoneyFromUsdCents(booking.amountUsdCents, "USD")}
          emphasize
        />
      </div>

      <div className="mt-5 rounded-control border border-border bg-bg/34 px-4 py-4">
        <p className="type-body-s font-semibold text-ink">Operational note</p>
        <p className="mt-1 type-body-s text-ink/62">
          Work the queue from the first pending item. Completing the current task moves the booking
          from Confirmed to In Progress.
        </p>
      </div>
    </section>
  );
}

export function VendorQueueIntro({ bookingCount, pendingTaskCount }: VendorQueueIntroProps) {
  return (
    <section className="panel-operational p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="type-label text-ink/45">Booking Queue</p>
          <h2 className="mt-3 type-heading-l text-ink">Confirmed bookings ready for follow-up.</h2>
          <p className="mt-2 type-body-s text-ink/62">
            Newest bookings stay visible with the action zone separated clearly on the right.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <QueueStat label="Total" value={String(bookingCount)} />
          <QueueStat label="Pending" value={String(pendingTaskCount)} highlight />
        </div>
      </div>
    </section>
  );
}

function FocusRow({
  label,
  value,
  mono,
  emphasize,
}: Readonly<{ label: string; value: string; mono?: boolean; emphasize?: boolean }>) {
  return (
    <div className="rounded-control border border-border/80 bg-paper/72 px-4 py-3">
      <p className="type-label text-ink/38">{label}</p>
      <p
        className={`mt-2 break-words text-[14px] leading-6 ${
          mono
            ? "font-mono text-[12px] tracking-wide text-ink/78"
            : emphasize
              ? "font-bold tabular-nums text-ink"
              : "font-semibold text-ink/84"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function QueueStat({
  label,
  value,
  highlight,
}: Readonly<{ label: string; value: string; highlight?: boolean }>) {
  return (
    <div
      className={`rounded-pill border px-4 py-2 ${
        highlight ? "border-accent/20 bg-accent-soft/70" : "border-border bg-bg/40"
      }`}
    >
      <span className="type-label text-ink/42">{label}</span>
      <span className="ml-2 text-[15px] font-semibold text-ink">{value}</span>
    </div>
  );
}
