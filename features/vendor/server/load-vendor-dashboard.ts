import { getSupabaseWriteEnvIssues } from "@/lib/env";
import { getSupabaseWriteClient } from "@/supabase/clients/server";

import {
  type RawVendorBookingRow,
  type VendorDashboardBooking,
  countPendingTasks,
  mapVendorBookings,
} from "./dashboard-model";
import type { VendorSessionPayload } from "./session-token";

export type VendorDashboardState =
  | {
      kind: "ok";
      vendorDisplayName: string;
      bookings: VendorDashboardBooking[];
      pendingTaskCount: number;
    }
  | {
      kind: "empty";
      vendorDisplayName: string;
    }
  | {
      kind: "unconfigured";
      missingKeys: string[];
    }
  | {
      kind: "error";
      message: string;
    };

export async function loadVendorDashboard(
  session: VendorSessionPayload,
): Promise<VendorDashboardState> {
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
        procedure_name,
        room_type,
        amount_usd_cents,
        created_at,
        patient:patients!bookings_patient_id_fkey(
          full_name,
          email
        ),
        hospital:hospitals!bookings_hospital_id_fkey(
          name,
          city
        ),
        doctor:doctors!bookings_doctor_id_fkey(
          name,
          years_experience
        ),
        tasks:booking_tasks(
          id,
          title,
          status,
          completed_at
        )
      `,
    )
    .eq("vendor_id", session.vendorId)
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    console.error("Failed to load vendor dashboard", error);
    return {
      kind: "error",
      message: "We could not load vendor bookings right now.",
    };
  }

  const bookings = mapVendorBookings((data ?? []) as RawVendorBookingRow[]);
  if (!bookings.length) {
    return {
      kind: "empty",
      vendorDisplayName: session.displayName,
    };
  }

  return {
    kind: "ok",
    vendorDisplayName: session.displayName,
    bookings,
    pendingTaskCount: countPendingTasks(bookings),
  };
}
