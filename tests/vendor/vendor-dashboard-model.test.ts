import { describe, expect, it } from "vitest";

import {
  type RawVendorBookingRow,
  countPendingTasks,
  mapVendorBookings,
} from "../../features/vendor/server/dashboard-model";

describe("vendor dashboard model", () => {
  it("maps booking rows with task details from a one-to-one relation", () => {
    const rows: RawVendorBookingRow[] = [
      {
        id: "booking-1",
        status: "Confirmed",
        procedure_name: "Total Knee Replacement",
        room_type: "Private",
        amount_usd_cents: 450000,
        created_at: "2026-04-22T10:00:00Z",
        patient: {
          full_name: "Amina Okafor",
          email: "amina@example.com",
        },
        hospital: {
          name: "Apollo Spectra",
          city: "Delhi",
        },
        doctor: {
          name: "Dr. Ramesh Kumar",
          years_experience: 16,
        },
        tasks: {
          id: "task-1",
          title: "Visa Invite Letter Sent",
          status: "Pending",
          completed_at: null,
        },
      },
    ];

    const bookings = mapVendorBookings(rows);

    expect(bookings).toHaveLength(1);
    expect(bookings[0]).toMatchObject({
      bookingId: "booking-1",
      bookingStatus: "Confirmed",
      hospitalName: "Apollo Spectra",
      doctorName: "Dr. Ramesh Kumar",
      taskId: "task-1",
      taskStatus: "Pending",
    });
    expect(countPendingTasks(bookings)).toBe(1);
  });

  it("skips malformed rows", () => {
    const rows: RawVendorBookingRow[] = [
      {
        id: "booking-2",
        status: "Confirmed",
        procedure_name: "Total Knee Replacement",
        room_type: "General Ward",
        amount_usd_cents: 300000,
        created_at: "2026-04-22T10:00:00Z",
        patient: null,
        hospital: {
          name: "Apollo Spectra",
          city: "Delhi",
        },
        doctor: {
          name: "Dr. Priya Sharma",
          years_experience: 12,
        },
        tasks: null,
      },
    ];

    expect(mapVendorBookings(rows)).toEqual([]);
  });
});
