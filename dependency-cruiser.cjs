module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "ui-primitives-must-stay-primitive",
      severity: "error",
      from: { path: "^components/ui" },
      to: { path: "^(app|features)" },
    },
    {
      name: "route-shells-cannot-reach-feature-internals",
      severity: "error",
      from: { path: "^app" },
      to: { path: "^features/[^/]+/(?!public(?:/|$))" },
    },
    {
      name: "client-render-cannot-import-server-brain",
      severity: "error",
      from: { path: "^(components/ui|features/[^/]+/(ui|client))" },
      to: { path: "^(features/[^/]+/server|lib/server|supabase)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: ["RepoBrainOs", "node_modules", "\\.next", "coverage"] },
    reporterOptions: { dot: { collapsePattern: "node_modules/[^/]+" } },
    tsConfig: { fileName: "tsconfig.json" },
  },
};
