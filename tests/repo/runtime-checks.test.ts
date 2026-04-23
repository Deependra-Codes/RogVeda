import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { collectRouteEntryBudgetResults } from "../../tools/repo/runtime-checks.mjs";
import {
  isDeniedPublicRpcAccessError,
  isExpectedRpcPreflightError,
  parseEnvFileText,
} from "../../tools/repo/supabase-access-checks.mjs";

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { force: true, recursive: true });
    }
  }
});

describe("repo runtime checks", () => {
  it("parses dotenv text without extra dependencies", () => {
    expect(
      parseEnvFileText(
        [
          "# comment",
          "NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321",
          "SUPABASE_SERVICE_ROLE_KEY='service-role-key'",
          "",
        ].join("\n"),
      ),
    ).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    });
  });

  it("measures gzip budgets from client-reference manifests", () => {
    const root = mkdtempSync(join(tmpdir(), "rogveda-runtime-checks-"));
    tempDirs.push(root);

    mkdirSync(join(root, ".next", "server", "app"), { recursive: true });
    mkdirSync(join(root, ".next", "static", "chunks"), { recursive: true });

    writeFileSync(
      join(root, ".next", "server", "app", "page_client-reference-manifest.js"),
      [
        "globalThis.__RSC_MANIFEST = globalThis.__RSC_MANIFEST || {};",
        'globalThis.__RSC_MANIFEST["/page"] = {',
        '  entryJSFiles: { "[project]/app/page": ["static/chunks/home.js"] }',
        "};",
        "",
      ].join("\n"),
    );
    writeFileSync(join(root, ".next", "static", "chunks", "home.js"), "console.log('home');\n");

    const [result] = collectRouteEntryBudgetResults(
      {
        performanceBudgets: {
          patientSearchInitialJsKbGzip: 10,
        },
        routeBudgetTargets: [
          {
            label: "patientSearch",
            route: "/",
            manifestPath: ".next/server/app/page_client-reference-manifest.js",
            entryKey: "[project]/app/page",
            budgetKey: "patientSearchInitialJsKbGzip",
          },
        ],
      },
      root,
    );

    expect(result.status).toBe("ok");
    expect(result.route).toBe("/");
    expect(result.withinBudget).toBe(true);
    expect(result.gzipBytes).toBeGreaterThan(0);
  });

  it("treats missing RPC schema entries as parity failures", () => {
    expect(
      isExpectedRpcPreflightError("create_booking_transaction", {
        code: "PGRST202",
        message: "Could not find the function in the schema cache",
      }),
    ).toBe(false);

    expect(
      isExpectedRpcPreflightError("complete_booking_task", {
        code: "P0001",
        message: "Task not found for vendor",
      }),
    ).toBe(true);
  });

  it("recognizes denied public RPC execution errors", () => {
    expect(
      isDeniedPublicRpcAccessError({
        code: "42501",
        message: "permission denied for function create_booking_transaction",
      }),
    ).toBe(true);

    expect(
      isDeniedPublicRpcAccessError({
        code: "PGRST202",
        message: "Could not find the function in the schema cache",
      }),
    ).toBe(true);

    expect(
      isDeniedPublicRpcAccessError({
        code: "P0001",
        message: "Invalid hospital, doctor, and room combination",
      }),
    ).toBe(false);
  });
});
