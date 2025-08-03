export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "style", "docs", "test", "build", "ci", "chore", "perf", "revert"]
    ],
    "scope-empty": [2, "never"],

    "subject-empty": [2, "never"],
    "subject-case": [2, "always", ["lower-case"]]
  }
};
