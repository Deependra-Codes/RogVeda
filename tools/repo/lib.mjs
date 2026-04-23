import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, matchesGlob, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { repoOsConfig } from "./repo-os.config.mjs";

export const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function toPosix(value) {
  return value.split(sep).join("/");
}

export function resolveFromRoot(...segments) {
  return resolve(workspaceRoot, ...segments);
}

export function readText(relativePath) {
  return readFileSync(resolveFromRoot(relativePath), "utf8");
}

export function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

export function pathExists(relativePath) {
  return existsSync(resolveFromRoot(relativePath));
}

export function hasCommand(command) {
  const result = spawnCommand(command, ["--version"], {
    cwd: workspaceRoot,
    encoding: "utf8",
  });
  return result.status === 0;
}

export function run(command, args, options = {}) {
  const result = spawnCommand(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    stdio: options.stdio ?? "inherit",
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(options.failureMessage ?? `${command} ${args.join(" ")} failed`);
  }
  return result;
}

export function capture(command, args, options = {}) {
  return spawnCommand(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: "utf8",
  });
}

export function matchesAny(relativePath, patterns) {
  const normalized = toPosix(relativePath);
  return patterns.some((pattern) => matchesGlob(normalized, pattern));
}

export function isIgnored(relativePath, config = repoOsConfig) {
  return matchesAny(relativePath, config.ignoreGlobs);
}

export function listFiles(relativeDir, extensions = null) {
  const root = resolveFromRoot(relativeDir);
  if (!existsSync(root)) {
    return [];
  }

  const files = [];
  walk(root, files);
  return files
    .map((absolutePath) => toPosix(relative(workspaceRoot, absolutePath)))
    .filter((filePath) => !isIgnored(filePath))
    .filter((filePath) => {
      if (!extensions) {
        return true;
      }
      return extensions.some((extension) => filePath.endsWith(extension));
    });
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

export function changedFiles() {
  const gitDir = resolveFromRoot(".git");
  if (!existsSync(gitDir)) {
    return [];
  }
  const result = capture("git", ["status", "--porcelain", "--untracked-files=all"]);
  if (result.status !== 0) {
    return [];
  }
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const rawPath = line.slice(3).trim();
      return rawPath.includes(" -> ") ? rawPath.split(" -> ").at(-1) : rawPath;
    })
    .map(toPosix);
}

export function classifyPaths(paths, config = repoOsConfig) {
  const protectedPaths = paths.filter((filePath) => matchesAny(filePath, config.protectedGlobs));
  const researchPaths = paths.filter((filePath) =>
    matchesAny(filePath, config.researchTriggerGlobs),
  );
  return {
    protectedPaths,
    researchPaths,
    isNonTrivial: protectedPaths.length > 0,
    needsResearch: researchPaths.length > 0,
  };
}

export function changedRecordKinds(paths) {
  return {
    intent: paths.some(
      (filePath) =>
        filePath.startsWith("docs/process/records/intents/") && !filePath.endsWith("README.md"),
    ),
    spec: paths.some(
      (filePath) =>
        filePath.startsWith("docs/process/records/specs/") && !filePath.endsWith("README.md"),
    ),
    research: paths.some(
      (filePath) =>
        filePath.startsWith("docs/process/records/research/") && !filePath.endsWith("README.md"),
    ),
    validation: paths.some(
      (filePath) =>
        filePath.startsWith("docs/process/records/validations/") && !filePath.endsWith("README.md"),
    ),
  };
}

export function hasUpdatedCurrentContext(paths, config = repoOsConfig) {
  return paths.includes(config.currentContextFile);
}

export function findUndocumentedDependencies(packageJson, reasons) {
  const allDependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  };
  return Object.keys(allDependencies).filter((name) => !reasons[name]);
}

export function validateRecordSlug(fileName) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(fileName)) {
    return false;
  }
  return !/^\d{4}-\d{2}-\d{2}-/.test(fileName);
}

export function formatViolations(title, items, render) {
  if (!items.length) {
    return [];
  }
  return [title, ...items.map(render)];
}

export function currentPackageJson() {
  return readJson("package.json");
}

function resolveCommand(command) {
  if (process.platform === "win32" && ["pnpm", "npm", "npx"].includes(command)) {
    return `${command}.cmd`;
  }
  return command;
}

function spawnCommand(command, args, options) {
  const resolved = resolveCommand(command);
  if (process.platform === "win32" && resolved.endsWith(".cmd")) {
    return spawnSync("cmd.exe", ["/d", "/s", "/c", resolved, ...args], options);
  }
  return spawnSync(resolved, args, options);
}
