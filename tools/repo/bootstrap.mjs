import { hasCommand, pathExists, run } from "./lib.mjs";

for (const command of ["node", "pnpm", "git"]) {
  if (!hasCommand(command)) {
    console.error(`Missing required command: ${command}`);
    process.exit(1);
  }
}

if (!pathExists(".git")) {
  run("git", ["init"], {
    failureMessage: "git init failed",
  });
}

run("pnpm", ["install"], {
  failureMessage: "pnpm install failed",
});

run("git", ["config", "core.hooksPath", ".githooks"], {
  failureMessage: "failed to configure core.hooksPath",
});

run("pnpm", ["repo:doctor"], {
  failureMessage: "repo doctor failed after bootstrap",
});

console.log("Bootstrap complete.");
console.log("Next steps:");
console.log("- pnpm repo:quality");
console.log("- pnpm repo:check");
