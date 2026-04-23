"use server";

import { redirect } from "next/navigation";

import { getSupabaseWriteClient } from "@/supabase/clients/server";

import {
  buildVendorDashboardRoute,
  buildVendorLoginRoute,
  parseCompleteTaskPayload,
} from "../types/contracts";
import { readVendorSession } from "./session";

export async function completeTaskAction(formData: FormData) {
  const session = await readVendorSession();
  if (!session) {
    redirect(buildVendorLoginRoute());
  }

  const parsed = parseCompleteTaskPayload(formData);
  if (!parsed.success) {
    redirect(
      buildVendorDashboardRoute({
        error: "invalid_task",
      }),
    );
  }

  const client = getSupabaseWriteClient();
  if (!client) {
    redirect(
      buildVendorDashboardRoute({
        error: "service_unavailable",
      }),
    );
  }

  const { error } = await client
    .rpc("complete_booking_task", {
      input_task_id: parsed.data.taskId,
      input_vendor_id: session.vendorId,
    } as never)
    .single();

  if (error) {
    console.error("Failed to complete booking task", error);
    redirect(
      buildVendorDashboardRoute({
        error: error.message.includes("Task not found for vendor") ? "invalid_task" : "task_failed",
      }),
    );
  }

  redirect(
    buildVendorDashboardRoute({
      status: "task_completed",
    }),
  );
}
