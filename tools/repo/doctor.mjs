import { formatViolations, hasCommand, pathExists } from "./lib.mjs";
import { repoOsConfig } from "./repo-os.config.mjs";

const violations = [];

for (const command of repoOsConfig.requiredCommands) {
  if (!hasCommand(command)) {
    violations.push(`missing required command: ${command}`);
  }
}

for (const filePath of repoOsConfig.requiredFiles) {
  if (!pathExists(filePath)) {
    violations.push(`missing required file: ${filePath}`);
  }
}

for (const dirPath of repoOsConfig.requiredDirs) {
  if (!pathExists(dirPath)) {
    violations.push(`missing required directory: ${dirPath}`);
  }
}

if (!pathExists(".git")) {
  violations.push(
    "missing .git directory; run `pnpm repo:bootstrap` to initialize hooks and git state",
  );
}

const output = formatViolations("Repo doctor failed:", violations, (item) => `- ${item}`);
if (output.length) {
  console.error(output.join("\n"));
  process.exit(1);
}

console.log("Repo doctor: all required commands, files, and directories are present.");
