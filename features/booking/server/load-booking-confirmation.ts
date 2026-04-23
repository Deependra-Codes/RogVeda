import { getSupabaseWriteEnvIssues } from "@/lib/env";
import { getSupabaseWriteClient } from "@/supabase/clients/server";

import {
  type BookingConfirmationRow,
  type LoadedBookingConfirmation,
  mapBookingConfirmation,
} from "./booking-model";

export type BookingConfirmationState =
  | {
      kind: "ok";
      confirmation: LoadedBookingConfirmation;
    }
  | {
      kind: "not_found";
    }
  | {
      kind: "unconfigured";
      missingKeys: string[];
    }
  | {
      kind: "error";
      message: string;
    };

export async function loadBookingConfirmation(
  bookingId: string,
): Promise<BookingConfirmationState> {
  const missingKeys = getSupabaseWriteEnvIssues();
  if (missingKeys.length) {
    return { kind: "unconfigured", missingKeys };
  }

  const client = getSupabaseWriteClient();
  if (!client) {
    return { kind: "unconfigured", missingKeys: getSupabaseWriteEnvIssues() };
  }

  const { data, error } = await client
    .from("bookings")
    .select(
      `
        id,
        status,
        room_type,
        amount_usd_cents,
        procedure_name,
        patient:patients!bookings_patient_id_fkey(
          full_name,
          email,
          wallet_balance_usd_cents
        ),
        hospital:hospitals!bookings_hospital_id_fkey(
          name
        ),
        doctor:doctors!bookings_doctor_id_fkey(
          name
        ),
        tasks:booking_tasks(
          title,
          status
        )
      `,
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load booking confirmation", error);
    return {
      kind: "error",
      message: "We could not load the booking confirmation right now.",
    };
  }

  const booking = data as BookingConfirmationRow | null;
  if (!booking || !booking.patient || !booking.hospital || !booking.doctor) {
    return { kind: "not_found" };
  }

  return {
    kind: "ok",
    confirmation: mapBookingConfirmation(booking),
  };
}
