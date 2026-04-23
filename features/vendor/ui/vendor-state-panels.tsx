import { VendorInfoPanel } from "./vendor-info-panel";

export function VendorEmptyStatePanel() {
  return (
    <VendorInfoPanel
      title="No bookings yet"
      body="Bookings will appear here after a patient confirms from the booking review route."
    />
  );
}
