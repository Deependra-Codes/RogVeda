import {
  changedFiles,
  changedRecordKinds,
  classifyPaths,
  currentPackageJson,
  findUndocumentedDependencies,
  formatViolations,
  hasUpdatedCurrentContext,
} from "./lib.mjs";
import {
  findFileLineViolations,
  findForbiddenFolders,
  findFunctionLengthViolations,
} from "./policy-helpers.mjs";
import { repoOsConfig } from "./repo-os.config.mjs";

const changed = changedFiles();
if (!changed.length) {
  console.log("Repo policy: no changed files detected.");
  process.exit(0);
}

const classification = classifyPaths(changed, repoOsConfig);
const recordKinds = changedRecordKinds(changed);
const violations = [];

if (classification.isNonTrivial) {
  if (!hasUpdatedCurrentContext(changed, repoOsConfig)) {
    violations.push("non-trivial changes require an updated docs/context/current-state.md");
  }
  if (!recordKinds.intent) {
    violations.push("non-trivial changes require an updated intent record");
  }
  if (!recordKinds.spec) {
    violations.push("non-trivial changes require an updated spec record");
  }
  if (!recordKinds.validation) {
    violations.push("non-trivial changes require an updated validation record");
  }
}

if (classification.needsResearch && !recordKinds.research) {
  violations.push("research-triggering changes require an updated research record");
}

for (const folderPath of findForbiddenFolders(repoOsConfig)) {
  violations.push(`forbidden folder name detected: ${folderPath}`);
}

for (const issue of findFileLineViolations(repoOsConfig)) {
  violations.push(
    `file too large: ${issue.filePath} (${issue.lineCount} lines, limit ${issue.limit})`,
  );
}

for (const issue of findFunctionLengthViolations(repoOsConfig)) {
  violations.push(
    `function too large: ${issue.filePath}:${issue.startLine} (${issue.lineCount} lines, limit ${issue.limit})`,
  );
}

for (const dependency of findUndocumentedDependencies(
  currentPackageJson(),
  repoOsConfig.dependencyJustifications,
)) {
  violations.push(`dependency missing written justification in repo-os config: ${dependency}`);
}

const output = formatViolations("Repo policy failed:", violations, (item) => `- ${item}`);
if (output.length) {
  console.error(output.join("\n"));
  process.exit(1);
}

console.log("Repo policy: all non-trivial records, dependency rules, and structure checks passed.");
