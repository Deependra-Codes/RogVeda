"use server";

import { redirect } from "next/navigation";

import { getSupabaseWriteClient } from "@/supabase/clients/server";
import type { CreateBookingTransactionResult } from "@/supabase/types";

import {
  type BookingSelection,
  buildBookingConfirmationRoute,
  buildBookingRoute,
  parseConfirmBookingPayload,
} from "../types/contracts";

export async function confirmBookingAction(formData: FormData) {
  const parsed = parseConfirmBookingPayload(formData);
  if (!parsed.success) {
    redirect(
      buildBookingRoute(
        {
          hospitalId: readHiddenSelection(formData, "hospitalId"),
          doctorId: readHiddenSelection(formData, "doctorId"),
          roomType: readHiddenSelection(formData, "roomType") as BookingSelection["roomType"],
          currency: readHiddenSelection(formData, "currency") as BookingSelection["currency"],
        },
        "invalid_request",
      ),
    );
  }

  const client = getSupabaseWriteClient();
  if (!client) {
    redirect(buildBookingRoute(parsed.data, "service_unavailable"));
  }

  const rpcResponse = await client
    .rpc("create_booking_transaction", {
      input_hospital_id: parsed.data.hospitalId,
      input_doctor_id: parsed.data.doctorId,
      input_room_type: parsed.data.roomType,
      input_patient_name: parsed.data.patientName,
      input_patient_email: parsed.data.patientEmail,
    } as never)
    .single();

  const data = rpcResponse.data as CreateBookingTransactionResult | null;
  const { error } = rpcResponse;

  if (error || !data) {
    console.error("Failed to confirm booking", error);
    redirect(
      buildBookingRoute(
        parsed.data,
        error?.message.includes("Invalid hospital, doctor, and room combination")
          ? "invalid_selection"
          : "booking_failed",
      ),
    );
  }

  redirect(buildBookingConfirmationRoute(data.booking_id, parsed.data.currency));
}

function readHiddenSelection(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
