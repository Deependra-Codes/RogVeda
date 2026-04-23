import Link from "next/link";

import { vendorFormActionRoutes } from "../types/contracts";

type VendorDashboardHeaderProps = Readonly<{
  vendorName: string;
}>;

export function VendorDashboardHeader({ vendorName }: VendorDashboardHeaderProps) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6 pt-2">
      <div className="max-w-[560px]">
        <div className="mb-2 flex items-center gap-3">
          <p className="type-label text-accent/72">Vendor Operations</p>
          <div className="status-chip-accent text-[10px]">Active</div>
        </div>
        <h1 className="type-heading-xl text-ink">{vendorName}</h1>
        <p className="mt-2 type-body-s text-ink/60">
          Operational workspace for confirmed bookings, task follow-up, and the first travel
          coordination handoff.
        </p>
      </div>
      <div className="flex items-center gap-3 self-start">
        <Link href="/" className="btn-tertiary text-sm">
          Patient Search
        </Link>
        <form action={vendorFormActionRoutes.logout} method="post">
          <button type="submit" className="btn-secondary text-sm">
            Sign Out
          </button>
        </form>
      </div>
    </section>
  );
}
