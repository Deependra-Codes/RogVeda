import type { RoomType } from "@/supabase/types";

import type { BookingSelection } from "../types/contracts";

export type LoadedBookingReview = {
  selection: BookingSelection;
  hospital: {
    name: string;
    city: string;
    locationLabel: string;
  };
  doctor: {
    name: string;
    yearsExperience: number;
  };
  procedureName: string;
  roomType: RoomType;
  amountUsdCents: number;
  patient: {
    fullName: string;
    email: string;
    walletBalanceUsdCents: number;
  };
};

export type LoadedBookingConfirmation = {
  bookingId: string;
  bookingStatus: string;
  procedureName: string;
  roomType: RoomType;
  amountUsdCents: number;
  hospitalName: string;
  doctorName: string;
  patientName: string;
  patientEmail: string;
  walletBalanceUsdCents: number;
  taskTitle: string;
  taskStatus: string;
};

export type BookingReviewPatientRow = {
  full_name: string;
  email: string;
  wallet_balance_usd_cents: number;
};

export type BookingReviewQuoteRow = {
  amount_usd_cents: number | null;
  room_type: RoomType | null;
  hospital: {
    name: string;
    city: string;
    region_label: string;
    procedure_name: string;
  } | null;
  doctor: {
    name: string;
    years_experience: number | null;
  } | null;
};

export type BookingConfirmationRow = {
  id: string;
  status: string;
  room_type: RoomType;
  amount_usd_cents: number;
  procedure_name: string;
  patient: {
    full_name: string;
    email: string;
    wallet_balance_usd_cents: number;
  } | null;
  hospital: {
    name: string;
  } | null;
  doctor: {
    name: string;
  } | null;
  tasks: Array<{
    title: string;
    status: string;
  }> | null;
};

export function mapBookingReview(
  selection: BookingSelection,
  quote: BookingReviewQuoteRow,
  patient: BookingReviewPatientRow | null,
  fallbackPatient: Readonly<{ fullName: string; email: string }>,
): LoadedBookingReview {
  return {
    selection,
    hospital: {
      name: quote.hospital?.name ?? "Selected hospital",
      city: quote.hospital?.city ?? "Delhi",
      locationLabel: quote.hospital?.region_label ?? "Delhi NCR",
    },
    doctor: {
      name: quote.doctor?.name ?? "Selected doctor",
      yearsExperience: quote.doctor?.years_experience ?? 0,
    },
    procedureName: quote.hospital?.procedure_name ?? "Total Knee Replacement",
    roomType: quote.room_type ?? selection.roomType,
    amountUsdCents: quote.amount_usd_cents ?? 0,
    patient: patient
      ? {
          fullName: patient.full_name,
          email: patient.email,
          walletBalanceUsdCents: patient.wallet_balance_usd_cents,
        }
      : {
          fullName: fallbackPatient.fullName,
          email: fallbackPatient.email,
          walletBalanceUsdCents: 0,
        },
  };
}

export function mapBookingConfirmation(booking: BookingConfirmationRow): LoadedBookingConfirmation {
  return {
    bookingId: booking.id,
    bookingStatus: booking.status,
    procedureName: booking.procedure_name,
    roomType: booking.room_type,
    amountUsdCents: booking.amount_usd_cents,
    hospitalName: booking.hospital?.name ?? "Hospital unavailable",
    doctorName: booking.doctor?.name ?? "Doctor unavailable",
    patientName: booking.patient?.full_name ?? "Patient unavailable",
    patientEmail: booking.patient?.email ?? "Patient unavailable",
    walletBalanceUsdCents: booking.patient?.wallet_balance_usd_cents ?? 0,
    taskTitle: booking.tasks?.[0]?.title ?? "Visa Invite Letter Sent",
    taskStatus: booking.tasks?.[0]?.status ?? "Pending",
  };
}
