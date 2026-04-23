import { describe, expect, it } from "vitest";

import {
  buildVendorDashboardRoute,
  buildVendorLoginRoute,
  getVendorDashboardErrorMessage,
  getVendorLoginErrorMessage,
  parseCompleteTaskPayload,
  parseVendorLoginPayload,
  readVendorDashboardError,
  readVendorDashboardStatus,
  readVendorLoginError,
} from "../../features/vendor/types/contracts";

describe("vendor contracts", () => {
  it("parses valid vendor login payload", () => {
    const formData = new FormData();
    formData.set("username", "apollo");
    formData.set("password", "apollo123");

    const parsed = parseVendorLoginPayload(formData);

    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      return;
    }

    expect(parsed.data).toEqual({
      username: "apollo",
      password: "apollo123",
    });
  });

  it("rejects invalid complete-task payload", () => {
    const formData = new FormData();
    formData.set("taskId", "not-a-uuid");

    const parsed = parseCompleteTaskPayload(formData);

    expect(parsed.success).toBe(false);
  });

  it("reads route errors and statuses safely", () => {
    expect(readVendorLoginError("invalid_credentials")).toBe("invalid_credentials");
    expect(readVendorLoginError("unexpected")).toBeNull();

    expect(readVendorDashboardError("task_failed")).toBe("task_failed");
    expect(readVendorDashboardError(["service_unavailable"])).toBe("service_unavailable");
    expect(readVendorDashboardError("other")).toBeNull();

    expect(readVendorDashboardStatus("task_completed")).toBe("task_completed");
    expect(readVendorDashboardStatus("other")).toBeNull();
  });

  it("builds vendor routes with encoded query params", () => {
    expect(buildVendorLoginRoute()).toBe("/vendor/login");
    expect(buildVendorLoginRoute("invalid_request")).toBe("/vendor/login?error=invalid_request");

    expect(buildVendorDashboardRoute()).toBe("/vendor/dashboard");
    expect(
      buildVendorDashboardRoute({
        error: "task_failed",
        status: "task_completed",
      }),
    ).toBe("/vendor/dashboard?error=task_failed&status=task_completed");
  });

  it("exposes user-friendly error messages", () => {
    expect(getVendorLoginErrorMessage("invalid_credentials")).toContain("credentials");
    expect(getVendorDashboardErrorMessage("unauthorized")).toContain("sign in");
  });
});
