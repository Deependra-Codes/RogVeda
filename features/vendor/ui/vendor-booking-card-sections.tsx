import { formatMoneyFromUsdCents } from "@/lib/currency";

import type { VendorDashboardBooking } from "../server/dashboard-model";

type VendorBookingTaskPanelProps = Readonly<{
  booking: VendorDashboardBooking;
  completeTaskAction: (formData: FormData) => Promise<void>;
}>;

export function VendorBookingHeader({
  booking,
  status,
}: Readonly<{ booking: VendorDashboardBooking; status: string }>) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <span className="font-mono text-[12px] font-medium tracking-wide text-ink/50">
        {booking.bookingId.slice(0, 8)}...
      </span>
      <StatusChip status={status} />
      <span className="ml-auto text-[12px] text-ink/40">{formatUtcDate(booking.createdAt)}</span>
    </div>
  );
}

export function VendorBookingDetails({ booking }: Readonly<{ booking: VendorDashboardBooking }>) {
  return (
    <>
      <div className="border-b border-border pb-4">
        <h3 className="text-[24px] font-semibold leading-[30px] tracking-tight text-ink">
          {booking.procedureName}
        </h3>
        <p className="mt-2 type-body-s text-ink/62">
          {booking.patientName} / {booking.hospitalName}, {booking.hospitalCity}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <DetailRow label="Patient" value={booking.patientName} />
        <DetailRow label="Email" value={booking.patientEmail} />
        <DetailRow label="Hospital" value={`${booking.hospitalName}, ${booking.hospitalCity}`} />
        <DetailRow
          label="Doctor"
          value={`${booking.doctorName} / ${booking.doctorYearsExperience} yrs`}
        />
        <DetailRow label="Room" value={booking.roomType} />
        <DetailRow
          label="Price"
          value={formatMoneyFromUsdCents(booking.amountUsdCents, "USD")}
          bold
        />
      </div>

      <p className="mt-4 border-t border-border/50 pt-4 type-body-s text-ink/55">
        Confirmed booking ready for the next coordination step.
      </p>
    </>
  );
}

export function VendorBookingTaskPanel({
  booking,
  completeTaskAction,
}: VendorBookingTaskPanelProps) {
  const isPending = booking.taskStatus === "Pending";

  return (
    <section
      className={`flex flex-col border-t p-5 sm:p-6 lg:border-l lg:border-t-0 ${
        isPending
          ? "border-accent/15 bg-[linear-gradient(180deg,rgba(216,236,232,0.68),rgba(216,236,232,0.34))]"
          : "border-border bg-[linear-gradient(180deg,rgba(255,250,242,0.72),rgba(228,236,232,0.2))]"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${isPending ? "animate-pulse bg-accent" : "bg-success"}`}
        />
        <p className="type-label text-ink/50">Task: {booking.taskStatus}</p>
      </div>

      <p className="text-[17px] font-semibold leading-6 text-ink">{booking.taskTitle}</p>
      <p className="mt-2 flex-grow type-body-s text-ink/55">
        {booking.taskCompletedAt
          ? `Completed ${formatUtcDate(booking.taskCompletedAt)}`
          : "Complete this task to move the booking from Confirmed to In Progress."}
      </p>

      {isPending && booking.taskId ? (
        <form action={completeTaskAction} className="mt-5 shrink-0">
          <input type="hidden" name="taskId" value={booking.taskId} />
          <button type="submit" className="btn-primary h-11 w-full text-[13px]">
            Mark Task Complete
          </button>
        </form>
      ) : (
        <div className="status-chip-success mt-4 w-fit">Task Complete</div>
      )}
    </section>
  );
}

function StatusChip({ status }: Readonly<{ status: string }>) {
  const isConfirmed = status === "Confirmed";
  const isInProgress = status === "In Progress";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
        isConfirmed
          ? "border-accent/20 bg-accent-soft/60 text-accent"
          : isInProgress
            ? "border-success/20 bg-success/10 text-success"
            : "border-border bg-bg text-ink/50"
      }`}
    >
      {status}
    </span>
  );
}

function DetailRow({
  label,
  value,
  bold,
}: Readonly<{ label: string; value: string; bold?: boolean }>) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="type-label text-[10px] text-ink/40">{label}</span>
      <span
        className={`break-words text-[13px] leading-tight ${
          bold ? "tabular-nums font-bold text-ink" : "font-medium text-ink/80"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatUtcDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
