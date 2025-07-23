import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Code Quality Rules - Maximum Cyclomatic Complexity
      complexity: [
        "error",
        {
          max: 12,
        },
      ],

      // Code Quality Rules - Maximum File Size
      "max-lines": [
        "error",
        {
          max: 200,
          skipComments: true,
          skipBlankLines: true,
        },
      ],

      // Additional maintainability rules
      "max-lines-per-function": [
        "error",
        {
          max: 200,
          skipComments: true,
          skipBlankLines: true,
        },
      ],

      "max-statements": ["error", { max: 12 }],
      "max-depth": ["error", { max: 4 }],
      "max-classes-per-file": ["error", 1],
    },
  },
]);
