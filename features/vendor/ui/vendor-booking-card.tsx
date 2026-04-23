import type { VendorDashboardBooking } from "../server/dashboard-model";
import {
  VendorBookingDetails,
  VendorBookingHeader,
  VendorBookingTaskPanel,
} from "./vendor-booking-card-sections";

type VendorBookingCardProps = Readonly<{
  booking: VendorDashboardBooking;
  completeTaskAction: (formData: FormData) => Promise<void>;
  index?: number;
}>;

export function VendorBookingCard({
  booking,
  completeTaskAction,
  index = 0,
}: VendorBookingCardProps) {
  const isPending = booking.taskStatus === "Pending";

  return (
    <article
      className={`panel-operational overflow-hidden border-l-[3px] animate-rv-slide-up ${
        isPending ? "border-l-accent" : "border-l-success/40"
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-5 sm:p-6">
          <VendorBookingHeader booking={booking} status={booking.bookingStatus} />
          <VendorBookingDetails booking={booking} />
        </div>
        <VendorBookingTaskPanel booking={booking} completeTaskAction={completeTaskAction} />
      </div>
    </article>
  );
}
