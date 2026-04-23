import { z } from "zod";

import {
  type RouteSearchParamValue,
  type RouteSearchParams,
  firstRouteSearchValue,
} from "../../../lib/route-search";

const vendorLoginErrorValues = [
  "invalid_request",
  "invalid_credentials",
  "service_unavailable",
] as const;

const vendorDashboardErrorValues = [
  "unauthorized",
  "service_unavailable",
  "dashboard_failed",
  "task_failed",
  "invalid_task",
] as const;

const vendorDashboardStatusValues = ["task_completed", "signed_in", "logged_out"] as const;

export const vendorLoginPayloadSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export const completeTaskPayloadSchema = z.object({
  taskId: z.string().uuid(),
});

export const vendorLoginErrorSchema = z.enum(vendorLoginErrorValues);
export const vendorDashboardErrorSchema = z.enum(vendorDashboardErrorValues);
export const vendorDashboardStatusSchema = z.enum(vendorDashboardStatusValues);

export type VendorLoginPayload = z.infer<typeof vendorLoginPayloadSchema>;
export type CompleteTaskPayload = z.infer<typeof completeTaskPayloadSchema>;
export type VendorLoginError = z.infer<typeof vendorLoginErrorSchema>;
export type VendorDashboardError = z.infer<typeof vendorDashboardErrorSchema>;
export type VendorDashboardStatus = z.infer<typeof vendorDashboardStatusSchema>;

export const vendorDemoCredentials = {
  username: "apollo",
  password: "apollo123",
} as const;

export function parseVendorLoginPayload(formData: FormData) {
  return vendorLoginPayloadSchema.safeParse(Object.fromEntries(formData));
}

export function parseCompleteTaskPayload(formData: FormData) {
  return completeTaskPayloadSchema.safeParse(Object.fromEntries(formData));
}

export function readVendorLoginError(rawValue: RouteSearchParamValue) {
  return vendorLoginErrorSchema.safeParse(firstRouteSearchValue(rawValue)).data ?? null;
}

export function readVendorDashboardError(rawValue: RouteSearchParamValue) {
  return vendorDashboardErrorSchema.safeParse(firstRouteSearchValue(rawValue)).data ?? null;
}

export function readVendorDashboardStatus(rawValue: RouteSearchParamValue) {
  return vendorDashboardStatusSchema.safeParse(firstRouteSearchValue(rawValue)).data ?? null;
}

export function getVendorLoginErrorMessage(errorCode: VendorLoginError) {
  const messages: Record<VendorLoginError, string> = {
    invalid_request: "The login request was incomplete. Please enter both username and password.",
    invalid_credentials: "The vendor credentials do not match the demo account. Please try again.",
    service_unavailable: "Vendor login is temporarily unavailable. Please try again in a moment.",
  };

  return messages[errorCode];
}

export function getVendorDashboardErrorMessage(errorCode: VendorDashboardError) {
  const messages: Record<VendorDashboardError, string> = {
    unauthorized: "Your vendor session expired. Please sign in again.",
    service_unavailable: "The dashboard service is currently unavailable.",
    dashboard_failed: "We could not load the vendor dashboard right now.",
    task_failed: "The task update failed and no booking state was changed.",
    invalid_task: "The selected task was invalid. Please refresh and try again.",
  };

  return messages[errorCode];
}

export function getVendorDashboardStatusMessage(status: VendorDashboardStatus) {
  const messages: Record<VendorDashboardStatus, string> = {
    task_completed: "Task completed. Booking status is now In Progress.",
    signed_in: "Signed in successfully.",
    logged_out: "Signed out from vendor dashboard.",
  };

  return messages[status];
}

export function buildVendorLoginRoute(errorCode?: VendorLoginError) {
  if (!errorCode) {
    return "/vendor/login";
  }

  const params = new URLSearchParams({ error: errorCode });
  return `/vendor/login?${params.toString()}`;
}

export function buildVendorDashboardRoute(
  input: Readonly<
    Partial<{
      error: VendorDashboardError;
      status: VendorDashboardStatus;
    }>
  > = {},
) {
  const params = new URLSearchParams();

  if (input.error) {
    params.set("error", input.error);
  }

  if (input.status) {
    params.set("status", input.status);
  }

  const query = params.toString();
  return query ? `/vendor/dashboard?${query}` : "/vendor/dashboard";
}

export function readVendorRouteSearchParams(searchParams: RouteSearchParams) {
  return {
    loginError: readVendorLoginError(searchParams.error),
    dashboardError: readVendorDashboardError(searchParams.error),
    dashboardStatus: readVendorDashboardStatus(searchParams.status),
  };
}
