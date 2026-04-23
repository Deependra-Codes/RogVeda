import { existsSync } from "node:fs";

import { currentPackageJson, listFiles, resolveFromRoot, run } from "./lib.mjs";
import { assertRouteJsBudgets } from "./runtime-checks.mjs";
import {
  assertSupabasePublicAccessBoundaries,
  assertSupabaseRpcParity,
} from "./supabase-access-checks.mjs";

run("pnpm", ["repo:policy"], { failureMessage: "repo policy failed" });
run("pnpm", ["repo:sync"], { failureMessage: "repo sync failed" });
run("pnpm", ["repo:quality"], { failureMessage: "repo quality failed" });

const packageJson = currentPackageJson();
const dependencies = {
  ...(packageJson.dependencies ?? {}),
  ...(packageJson.devDependencies ?? {}),
};

const hasNext = Boolean(dependencies.next);
const hasPlaywright = Boolean(dependencies["@playwright/test"]);
const hasLhci = Boolean(dependencies["@lhci/cli"]);
const hasRoutes = listFiles("app", [".js", ".jsx", ".ts", ".tsx"]).some(
  (filePath) => !filePath.endsWith("README.md"),
);
const hasE2eTests = listFiles("tests/e2e", [".js", ".jsx", ".ts", ".tsx"]).some(
  (filePath) => !filePath.endsWith("README.md"),
);

if (hasNext && hasRoutes) {
  run("pnpm", ["build"], { failureMessage: "next build failed" });
  assertRouteJsBudgets();
} else {
  console.log("Repo check: skipped Next build because app runtime is not scaffolded yet.");
}

if (hasPlaywright && hasE2eTests) {
  await assertSupabaseRpcParity();
  run("pnpm", ["exec", "playwright", "test", "--pass-with-no-tests"], {
    failureMessage: "playwright smoke tests failed",
  });
  await assertSupabasePublicAccessBoundaries();
} else {
  console.log("Repo check: skipped Playwright because no e2e tests exist yet.");
}

if (hasLhci && hasNext && existsSync(resolveFromRoot("lighthouserc.json"))) {
  run("pnpm", ["exec", "lhci", "autorun"], { failureMessage: "Lighthouse CI failed" });
} else {
  console.log("Repo check: skipped Lighthouse because runtime budget config is not ready yet.");
}

console.log("Repo check: all active checks passed.");
