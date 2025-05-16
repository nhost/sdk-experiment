import js from "@eslint/js";
import globals from "globals";
import { configs } from "typescript-eslint";

/**
 * Base ESLint configuration for all Nhost projects
 * Features:
 * - TypeScript support
 * - Modern ECMAScript features
 * - Strict type checking
 * - Best practices
 */
export default [
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      ".next",
      "coverage",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ...js.configs.recommended,
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // TypeScript specific configuration
  ...configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      // Enforce explicit types and strict typing
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      
      // General code quality
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "object-shorthand": "error",
      "arrow-body-style": ["error", "as-needed"],
      
      // Security
      "no-eval": "error",
      "no-new-func": "error",
      "no-implied-eval": "error",
    },
  },
];