import baseConfig from "../../configs/eslint/base.mjs";

// Specific ignores for the nhost-js SDK
const ignores = ["src/auth/client.ts", "src/storage/client.ts"];

export default [
  ...baseConfig,
  {
    ignores,
  },
  // Configuration for source files (non-test)
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },
    rules: {
      // SDK-specific rules
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["*/internal/*"],
        },
      ],
    },
  },
  // Configuration specifically for test files
  // This overrides the type-checking rules for files that are excluded in tsconfig.json
  {
    files: ["src/**/__tests__/**/*.ts", "src/**/*.test.ts"],
    languageOptions: {
      parserOptions: {
        project: null, // Disable project for test files
      },
    },
    rules: {
      // Disable TypeScript rules that require type information
      "@typescript-eslint/consistent-type-exports": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-import-type-side-effects": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  // Configuration specifically for docstrings test files
  {
    files: ["src/__tests__/docstrings*.test.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
