import { getSupabaseWriteEnvIssues } from "@/lib/env";
import { getSupabaseWriteClient } from "@/supabase/clients/server";

import { type BookingSelection, demoPatientProfile } from "../types/contracts";
import {
  type BookingReviewPatientRow,
  type BookingReviewQuoteRow,
  type LoadedBookingReview,
  mapBookingReview,
} from "./booking-model";

export type BookingReviewState =
  | {
      kind: "ok";
      review: LoadedBookingReview;
    }
  | {
      kind: "invalid_selection";
    }
  | {
      kind: "unconfigured";
      missingKeys: string[];
    }
  | {
      kind: "error";
      message: string;
    };

// repo-os: allow-long-function - this loader is the single server boundary for booking review data.
export async function loadBookingReview(selection: BookingSelection): Promise<BookingReviewState> {
  const missingKeys = getSupabaseWriteEnvIssues();
  if (missingKeys.length) {
    return { kind: "unconfigured", missingKeys };
  }

  const client = getSupabaseWriteClient();
  if (!client) {
    return { kind: "unconfigured", missingKeys: getSupabaseWriteEnvIssues() };
  }

  const [quoteResult, patientResult] = await Promise.all([
    client
      .from("pricing")
      .select(
        `
          amount_usd_cents,
          room_type,
          hospital:hospitals!pricing_hospital_id_fkey(
            name,
            city,
            region_label,
            procedure_name
          ),
          doctor:doctors!pricing_doctor_id_fkey(
            name,
            years_experience
          )
        `,
      )
      .eq("hospital_id", selection.hospitalId)
      .eq("doctor_id", selection.doctorId)
      .eq("room_type", selection.roomType)
      .maybeSingle(),
    client
      .from("patients")
      .select("full_name,email,wallet_balance_usd_cents")
      .eq("email", demoPatientProfile.email)
      .maybeSingle(),
  ]);

  if (quoteResult.error) {
    console.error("Failed to load booking quote", quoteResult.error);
    return {
      kind: "error",
      message: "We could not load the selected treatment quote right now.",
    };
  }

  if (patientResult.error) {
    console.error("Failed to load demo patient profile", patientResult.error);
    return {
      kind: "error",
      message: "We could not load the patient wallet balance right now.",
    };
  }

  const quote = quoteResult.data as BookingReviewQuoteRow | null;
  const patient = patientResult.data as BookingReviewPatientRow | null;
  if (
    !quote ||
    !quote.hospital ||
    !quote.doctor ||
    !quote.room_type ||
    quote.amount_usd_cents === null
  ) {
    return { kind: "invalid_selection" };
  }

  return {
    kind: "ok",
    review: mapBookingReview(selection, quote, patient, demoPatientProfile),
  };
}
