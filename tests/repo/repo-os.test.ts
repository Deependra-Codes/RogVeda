import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  classifyPaths,
  findUndocumentedDependencies,
  hasUpdatedCurrentContext,
  validateRecordSlug,
} from "../../tools/repo/lib.mjs";
import {
  findFileLineViolations,
  findForbiddenFolders,
  findFunctionLengthViolations,
} from "../../tools/repo/policy-helpers.mjs";
import { repoOsConfig } from "../../tools/repo/repo-os.config.mjs";

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { force: true, recursive: true });
    }
  }
});

describe("repo OS policy helpers", () => {
  it("classifies protected and research-trigger paths", () => {
    const result = classifyPaths(
      ["features/patient/card.tsx", "supabase/migrations/001_init.sql"],
      repoOsConfig,
    );
    expect(result.isNonTrivial).toBe(true);
    expect(result.needsResearch).toBe(true);
  });

  it("finds undocumented dependencies", () => {
    const missing = findUndocumentedDependencies(
      {
        dependencies: { "example-untracked-dependency": "^1.0.0" },
        devDependencies: { vitest: "^3.2.4" },
      },
      repoOsConfig.dependencyJustifications,
    );
    expect(missing).toEqual(["example-untracked-dependency"]);
  });

  it("requires a current-state context update for non-trivial work", () => {
    expect(
      hasUpdatedCurrentContext(
        ["features/patient/card.tsx", "docs/context/current-state.md"],
        repoOsConfig,
      ),
    ).toBe(true);
    expect(hasUpdatedCurrentContext(["features/patient/card.tsx"], repoOsConfig)).toBe(false);
  });

  it("rejects forbidden folder names", () => {
    const root = mkdtempSync(join(tmpdir(), "rogveda-policy-"));
    tempDirs.push(root);
    mkdirSync(join(root, "features", "helpers"), { recursive: true });
    writeFileSync(join(root, "features", "helpers", "x.ts"), "export const x = 1;\n");
    expect(findForbiddenFolders(repoOsConfig, root)).toContain("features/helpers");
  });

  it("detects line-count and function-size violations", () => {
    const root = mkdtempSync(join(tmpdir(), "rogveda-lines-"));
    tempDirs.push(root);
    mkdirSync(join(root, "features"), { recursive: true });
    const largeFile = `${Array.from({ length: 310 }, () => "const a = 1;").join("\n")}\n`;
    writeFileSync(join(root, "features", "big.ts"), largeFile);
    const longFunction = [
      "export function tooLong() {",
      ...Array.from({ length: 61 }, () => "  console.log('x');"),
      "}",
      "",
    ].join("\n");
    writeFileSync(join(root, "features", "long-function.ts"), longFunction);

    expect(
      findFileLineViolations(repoOsConfig, root).some(
        (item: { filePath: string }) => item.filePath === "features/big.ts",
      ),
    ).toBe(true);
    expect(
      findFunctionLengthViolations(repoOsConfig, root).some(
        (item: { filePath: string }) => item.filePath === "features/long-function.ts",
      ),
    ).toBe(true);
  });

  it("validates slug filenames", () => {
    expect(validateRecordSlug("engineering-os-bootstrap.md")).toBe(true);
    expect(validateRecordSlug("2026-04-22-bootstrap.md")).toBe(false);
  });
});
