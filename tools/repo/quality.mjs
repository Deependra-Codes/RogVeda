import { run } from "./lib.mjs";

const commands = [
  ["pnpm", ["exec", "biome", "check", "."]],
  ["pnpm", ["exec", "tsc", "--noEmit"]],
  ["pnpm", ["exec", "vitest", "run", "--passWithNoTests"]],
  ["pnpm", ["exec", "knip", "--config", "knip.json"]],
  ["pnpm", ["exec", "depcruise", "--config", "dependency-cruiser.cjs", "."]],
];

for (const [command, args] of commands) {
  run(command, args, {
    failureMessage: `${command} ${args.join(" ")} failed`,
  });
}

console.log(
  "Repo quality: formatting, typechecks, tests, dead-code checks, and boundaries passed.",
);
