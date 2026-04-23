import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { gzipSync } from "node:zlib";

import { workspaceRoot } from "./lib.mjs";
import { repoOsConfig } from "./repo-os.config.mjs";

export function collectRouteEntryBudgetResults(config = repoOsConfig, root = workspaceRoot) {
  return config.routeBudgetTargets.map((target) => {
    const manifest = readClientReferenceManifest(target.manifestPath, root);
    const entryFiles = manifest.entryJSFiles?.[target.entryKey];

    if (!entryFiles?.length) {
      return {
        label: target.label,
        route: target.route,
        status: "missing-entry",
        manifestPath: target.manifestPath,
      };
    }

    const gzipBytes = entryFiles.reduce(
      (total, filePath) => total + gzipSync(readBuildFile(filePath, root)).length,
      0,
    );
    const limitBytes = Math.round(config.performanceBudgets[target.budgetKey] * 1024);

    return {
      label: target.label,
      route: target.route,
      status: "ok",
      entryKey: target.entryKey,
      files: entryFiles,
      gzipBytes,
      limitBytes,
      gzipKilobytes: toKilobytes(gzipBytes),
      limitKilobytes: toKilobytes(limitBytes),
      withinBudget: gzipBytes <= limitBytes,
    };
  });
}

export function findRouteBudgetViolations(config = repoOsConfig, root = workspaceRoot) {
  return collectRouteEntryBudgetResults(config, root).filter(
    (result) => result.status !== "ok" || !result.withinBudget,
  );
}

export function assertRouteJsBudgets(config = repoOsConfig, root = workspaceRoot) {
  const violations = findRouteBudgetViolations(config, root);
  if (!violations.length) {
    return collectRouteEntryBudgetResults(config, root);
  }

  const lines = violations.map((violation) => {
    if (violation.status !== "ok") {
      return `- ${violation.route}: missing client entry for ${violation.manifestPath}`;
    }

    return `- ${violation.route}: ${violation.gzipKilobytes} KB gzip exceeds ${violation.limitKilobytes} KB budget`;
  });

  throw new Error(`route JS budget check failed:\n${lines.join("\n")}`);
}

function readClientReferenceManifest(relativePath, root) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`missing client reference manifest: ${relativePath}`);
  }

  const sandbox = { globalThis: {} };
  runInNewContext(readFileSync(absolutePath, "utf8"), sandbox);
  const manifestKeys = Object.keys(sandbox.globalThis.__RSC_MANIFEST ?? {});
  const manifest = sandbox.globalThis.__RSC_MANIFEST?.[manifestKeys[0]];

  if (!manifest) {
    throw new Error(`invalid client reference manifest: ${relativePath}`);
  }

  return manifest;
}

function readBuildFile(filePath, root) {
  const absolutePath = resolve(root, ".next", filePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`missing build asset: ${filePath}`);
  }

  return readFileSync(absolutePath);
}

function toKilobytes(value) {
  return (value / 1024).toFixed(1);
}
