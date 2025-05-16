import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import baseConfig from "./base.mjs";

/**
 * React specific ESLint configuration for Nhost projects
 * Features:
 * - React best practices
 * - React Hooks rules
 * - JSX accessibility
 * - React performance optimizations
 */
export default [
  ...baseConfig,
  {
    files: ["**/*.{tsx,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: "readonly",
        JSX: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react": reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React hooks
      ...reactHooks.configs.recommended.rules,
      
      // React refresh for HMR
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      
      // React specific rules
      "react/boolean-prop-naming": ["error", { rule: "^(is|has)[A-Z]([A-Za-z0-9]?)+" }],
      "react/button-has-type": "error",
      "react/destructuring-assignment": ["error", "always"],
      "react/function-component-definition": ["error", { namedComponents: "arrow-function" }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-pascal-case": "error",
      "react/no-array-index-key": "error",
      "react/no-danger": "error",
      "react/no-multi-comp": "error",
      "react/no-unstable-nested-components": "error",
      "react/no-unused-prop-types": "error",
      "react/prop-types": "off", // We use TypeScript instead
      "react/self-closing-comp": "error",
      
      // TypeScript specific rules for React
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          prefix: ["T"],
        },
      ],
    },
  },
];