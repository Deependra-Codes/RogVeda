import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve, sep } from "node:path";

import { isIgnored, listFiles, matchesAny, toPosix, workspaceRoot } from "./lib.mjs";
import { repoOsConfig } from "./repo-os.config.mjs";

export function findForbiddenFolders(config = repoOsConfig, root = workspaceRoot) {
  const violations = [];
  for (const baseDir of config.sourceRoots) {
    const targetDir = resolve(root, baseDir);
    if (!existsSync(targetDir)) {
      continue;
    }
    scanDirectories(targetDir, (absolutePath) => {
      const repoRelative = toPosix(absolutePath.slice(root.length + 1));
      const name = absolutePath.split(sep).at(-1)?.toLowerCase() ?? "";
      if (!isIgnored(repoRelative, config) && config.forbiddenFolderNames.includes(name)) {
        violations.push(repoRelative);
      }
    });
  }
  return violations;
}

export function findFileLineViolations(config = repoOsConfig, root = workspaceRoot) {
  return collectOwnedFiles(config, root).flatMap((filePath) => {
    const contents = readFileSync(resolve(root, filePath), "utf8");
    const lineCount = contents.split(/\r?\n/).length;
    const limit =
      filePath.endsWith(".tsx") || filePath.endsWith(".jsx")
        ? config.limits.maxReactFileLines
        : config.limits.maxFileLines;
    return lineCount > limit ? [{ filePath, lineCount, limit }] : [];
  });
}

export function findFunctionLengthViolations(config = repoOsConfig, root = workspaceRoot) {
  const violations = [];
  for (const filePath of collectOwnedFiles(config, root)) {
    const lines = readFileSync(resolve(root, filePath), "utf8").split(/\r?\n/);
    let current = null;
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (!current && isFunctionStart(line)) {
        current = {
          startLine: index + 1,
          length: 1,
          braceDepth: braceDelta(line),
          allowed: lines
            .slice(Math.max(0, index - 3), index + 1)
            .some((entry) => entry.includes("repo-os: allow-long-function")),
        };
        if (current.braceDepth <= 0) {
          current = null;
        }
        continue;
      }
      if (current) {
        current.length += 1;
        current.braceDepth += braceDelta(line);
        if (current.braceDepth <= 0) {
          if (!current.allowed && current.length > config.limits.maxFunctionLines) {
            violations.push({
              filePath,
              startLine: current.startLine,
              lineCount: current.length,
              limit: config.limits.maxFunctionLines,
            });
          }
          current = null;
        }
      }
    }
  }
  return violations;
}

function collectOwnedFiles(config, root) {
  return config.sourceRoots
    .flatMap((sourceRoot) => listFilesFromRoot(root, sourceRoot))
    .filter((filePath) => matchesAny(filePath, config.sourceFileGlobs))
    .filter((filePath) => !matchesAny(filePath, config.sizeExemptGlobs));
}

function listFilesFromRoot(root, relativeDir) {
  const targetDir = resolve(root, relativeDir);
  if (!existsSync(targetDir)) {
    return [];
  }
  const files = [];
  walk(targetDir, files);
  return files.map((absolutePath) => toPosix(absolutePath.slice(root.length + 1)));
}

function walk(currentPath, files) {
  const entries = readdirSync(currentPath, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = join(currentPath, entry.name);
    if (entry.isDirectory()) {
      walk(absolutePath, files);
    } else {
      files.push(absolutePath);
    }
  }
}

function scanDirectories(currentPath, onDirectory) {
  onDirectory(currentPath);
  const entries = readdirSync(currentPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      scanDirectories(join(currentPath, entry.name), onDirectory);
    }
  }
}

function isFunctionStart(line) {
  const patterns = [
    /^\s*(export\s+)?(async\s+)?function\s+[A-Za-z0-9_]+\s*\(/,
    /^\s*(const|let|var)\s+[A-Za-z0-9_]+\s*=\s*(async\s*)?\([^)]*\)\s*=>\s*\{/,
    /^\s*[A-Za-z0-9_]+\s*:\s*(async\s*)?\([^)]*\)\s*=>\s*\{/,
  ];
  return patterns.some((pattern) => pattern.test(line));
}

function braceDelta(line) {
  return [...line].reduce((delta, character) => {
    if (character === "{") {
      return delta + 1;
    }
    if (character === "}") {
      return delta - 1;
    }
    return delta;
  }, 0);
}
