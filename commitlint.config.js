export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "db",
        "ui",
        "auth",
        "api",
        "types",
        "constants",
        "chat",
        "calendar",
        "config",
        "deps", // for dependency updates
        "release" // for version bumps (e.g., standard-version)
      ]
    ],
    "scope-case": [2, "always", "kebab-case"],
    "subject-case": [2, "always", ["sentence-case"]],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "style", "docs", "test", "build", "ci", "chore", "perf", "revert"]
    ]
  }
};
