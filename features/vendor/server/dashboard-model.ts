import type { BookingStatus, BookingTaskStatus, RoomType } from "@/supabase/types";

type RawTaskRow = {
  id: string;
  title: string;
  status: BookingTaskStatus;
  completed_at: string | null;
};

export type RawVendorBookingRow = {
  id: string;
  status: BookingStatus;
  procedure_name: string;
  room_type: RoomType;
  amount_usd_cents: number;
  created_at: string;
  patient: {
    full_name: string;
    email: string;
  } | null;
  hospital: {
    name: string;
    city: string;
  } | null;
  doctor: {
    name: string;
    years_experience: number | null;
  } | null;
  tasks: RawTaskRow | RawTaskRow[] | null;
};

export type VendorDashboardBooking = {
  bookingId: string;
  bookingStatus: BookingStatus;
  procedureName: string;
  roomType: RoomType;
  amountUsdCents: number;
  createdAt: string;
  patientName: string;
  patientEmail: string;
  hospitalName: string;
  hospitalCity: string;
  doctorName: string;
  doctorYearsExperience: number;
  taskId: string | null;
  taskTitle: string;
  taskStatus: BookingTaskStatus;
  taskCompletedAt: string | null;
};

export function mapVendorBookings(rows: RawVendorBookingRow[]) {
  return rows.flatMap((row) => {
    if (!row.patient || !row.hospital || !row.doctor) {
      return [];
    }

    const task = Array.isArray(row.tasks) ? (row.tasks[0] ?? null) : row.tasks;

    return [
      {
        bookingId: row.id,
        bookingStatus: row.status,
        procedureName: row.procedure_name,
        roomType: row.room_type,
        amountUsdCents: row.amount_usd_cents,
        createdAt: row.created_at,
        patientName: row.patient.full_name,
        patientEmail: row.patient.email,
        hospitalName: row.hospital.name,
        hospitalCity: row.hospital.city,
        doctorName: row.doctor.name,
        doctorYearsExperience: row.doctor.years_experience ?? 0,
        taskId: task?.id ?? null,
        taskTitle: task?.title ?? "Visa Invite Letter Sent",
        taskStatus: task?.status ?? "Pending",
        taskCompletedAt: task?.completed_at ?? null,
      } satisfies VendorDashboardBooking,
    ];
  });
}

export function countPendingTasks(bookings: VendorDashboardBooking[]) {
  return bookings.filter((booking) => booking.taskStatus === "Pending").length;
}
