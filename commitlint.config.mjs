export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New features
        "fix", // Bug fixes
        "refactor", // Code changes without new features or fixes
        "style", // Formatting, missing semicolons, etc.
        "docs", // Documentation only changes
        "test", // Adding or updating tests
        "build", // Build system or external dependencies
        "ci", // CI configuration files and scripts
        "chore", // Other changes that don't modify src or test files
        "perf", // Performance improvements
        "revert" // Reverts a previous commit
      ]
    ],
    "scope-empty": [2, "always"], // no scopes allowed
    "subject-empty": [2, "never"], // Subject is required
    "subject-case": [2, "always", ["lower-case"]] // Subject in lower-case
  }
};
