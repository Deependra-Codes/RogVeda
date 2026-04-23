import { basename } from "node:path";

import { formatViolations, listFiles, readText, validateRecordSlug } from "./lib.mjs";
import { repoOsConfig } from "./repo-os.config.mjs";

const violations = [];

for (const entry of repoOsConfig.syncIndexes) {
  const readmeText = readText(entry.readme);
  const indexedFiles = listFiles(entry.directory, [".md"]).filter(
    (filePath) => basename(filePath) !== "README.md",
  );
  for (const filePath of indexedFiles) {
    const fileName = basename(filePath);
    if (!readmeText.includes(fileName)) {
      violations.push(`${entry.readme} is missing ${fileName}`);
    }
  }
}

for (const filePath of [
  ...listFiles("docs/process/records/intents", [".md"]),
  ...listFiles("docs/process/records/research", [".md"]),
  ...listFiles("docs/process/records/specs", [".md"]),
  ...listFiles("docs/process/records/validations", [".md"]),
]) {
  const fileName = basename(filePath);
  if (fileName !== "README.md" && !validateRecordSlug(fileName)) {
    violations.push(`record file must use slug naming: ${filePath}`);
  }
}

for (const mirror of repoOsConfig.mirrorChecks) {
  const contents = readText(mirror.file);
  for (const snippet of mirror.mustInclude) {
    if (!contents.includes(snippet)) {
      violations.push(`${mirror.file} must include ${snippet}`);
    }
  }
}

const output = formatViolations("Repo sync failed:", violations, (item) => `- ${item}`);
if (output.length) {
  console.error(output.join("\n"));
  process.exit(1);
}

console.log("Repo sync: indexes, record slugs, and mirrors are in sync.");
