import { redirect } from "next/navigation";

import type { RouteSearchParams } from "@/lib/route-search";

import { loadVendorDashboard } from "../server/load-vendor-dashboard";
import { readVendorSession } from "../server/session";
import {
  buildVendorLoginRoute,
  getVendorDashboardErrorMessage,
  getVendorDashboardStatusMessage,
  readVendorDashboardError,
  readVendorDashboardStatus,
} from "../types/contracts";
import { VendorBookingCard } from "../ui/vendor-booking-card";
import { VendorDashboardHeader } from "../ui/vendor-dashboard-header";
import { VendorFocusPanel, VendorQueueIntro } from "../ui/vendor-dashboard-layout";
import { VendorInfoPanel } from "../ui/vendor-info-panel";
import { VendorEmptyStatePanel } from "../ui/vendor-state-panels";
import { VendorSummaryPanel } from "../ui/vendor-summary-panel";

type VendorDashboardPageProps = Readonly<{
  searchParams: RouteSearchParams;
}>;

// repo-os: allow-long-function - page-level server boundary composes the dashboard state branches.
export async function VendorDashboardPage({ searchParams }: VendorDashboardPageProps) {
  const session = await readVendorSession();
  if (!session) {
    redirect(buildVendorLoginRoute());
  }

  const dashboardState = await loadVendorDashboard(session);
  const dashboardError = readVendorDashboardError(searchParams.error);
  const dashboardStatus = readVendorDashboardStatus(searchParams.status);
  const featuredBooking =
    dashboardState.kind === "ok"
      ? (dashboardState.bookings.find((booking) => booking.taskStatus === "Pending") ??
        dashboardState.bookings[0])
      : undefined;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,109,104,0.06),transparent_24%),radial-gradient(circle_at_top_right,rgba(162,103,34,0.06),transparent_20%),linear-gradient(180deg,rgba(255,250,242,0.7),rgba(244,238,227,0.96))] px-4 py-8 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
        <VendorDashboardHeader vendorName={session.displayName} />

        {dashboardState.kind === "unconfigured" ? (
          <VendorInfoPanel
            title="Backend setup needed"
            body={`Missing: ${dashboardState.missingKeys.join(", ")}`}
          />
        ) : null}

        {dashboardState.kind === "error" ? (
          <VendorInfoPanel
            title="Dashboard could not load"
            body={dashboardState.message}
            tone="error"
          />
        ) : null}

        {dashboardState.kind === "empty" ? <VendorEmptyStatePanel /> : null}

        {dashboardState.kind === "ok" ? (
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-8">
              {dashboardStatus ? (
                <VendorInfoPanel
                  title="Update"
                  body={getVendorDashboardStatusMessage(dashboardStatus)}
                  tone="success"
                />
              ) : null}
              {dashboardError ? (
                <VendorInfoPanel
                  title="Action Needed"
                  body={getVendorDashboardErrorMessage(dashboardError)}
                  tone="error"
                />
              ) : null}

              <VendorSummaryPanel
                bookingCount={dashboardState.bookings.length}
                pendingTaskCount={dashboardState.pendingTaskCount}
              />
              <VendorFocusPanel booking={featuredBooking} />
            </aside>

            <section className="space-y-4 lg:col-span-8">
              <VendorQueueIntro
                bookingCount={dashboardState.bookings.length}
                pendingTaskCount={dashboardState.pendingTaskCount}
              />
              {dashboardState.bookings.map((booking, index) => (
                <VendorBookingCard key={booking.bookingId} booking={booking} index={index} />
              ))}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
