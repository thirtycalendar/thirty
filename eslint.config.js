import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";

import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import unicorn from "eslint-plugin-unicorn";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
  globalIgnores([
    ".svelte-kit/",
    ".vercel/",
    ".husky/pre-commit",
    "utils/",
    "**/migrations-dev/**",
    "**/migrations-prod/**"
  ]),
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    plugins: {
      unicorn
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"]
        }
      ]
    }
  }
);
