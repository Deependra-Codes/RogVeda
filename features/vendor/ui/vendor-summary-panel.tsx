type VendorSummaryPanelProps = Readonly<{
  bookingCount: number;
  pendingTaskCount: number;
}>;

export function VendorSummaryPanel({ bookingCount, pendingTaskCount }: VendorSummaryPanelProps) {
  return (
    <section className="panel-operational bg-[linear-gradient(180deg,rgba(255,250,242,0.98),rgba(228,236,232,0.48))] p-6 sm:p-7">
      <p className="type-label text-accent/72">Workload Summary</p>
      <p className="mt-3 type-body-s text-ink/62">
        This route reads the same persisted booking source as the patient confirmation flow. The
        summary stays intentionally compact so the queue remains the main workspace.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricBlock label="Total Bookings" value={String(bookingCount)} />
        <MetricBlock
          label="Pending Tasks"
          value={String(pendingTaskCount)}
          highlight={pendingTaskCount > 0}
        />
      </div>

      <div className="mt-5 rounded-control border border-border bg-bg/34 px-4 py-4">
        <p className="type-body-s font-semibold text-ink">Freshness</p>
        <p className="mt-1 type-body-s text-ink/62">
          Refresh or complete a task to see the booking workflow progress update on the same saved
          record.
        </p>
      </div>
    </section>
  );
}

function MetricBlock({
  label,
  value,
  highlight,
}: Readonly<{ label: string; value: string; highlight?: boolean }>) {
  return (
    <div
      className={`rounded-[22px] border px-5 py-4 transition-colors ${
        highlight ? "border-accent/25 bg-accent-soft/55" : "border-border bg-paper/70"
      }`}
    >
      <p className="type-label text-ink/50">{label}</p>
      <p
        className={`mt-2 text-[32px] font-bold tracking-tight tabular-nums ${
          highlight ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
