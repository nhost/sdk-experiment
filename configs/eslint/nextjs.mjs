import reactConfig from "./react.mjs";
import nextPlugin from "@next/eslint-plugin-next";

/**
 * Next.js specific ESLint configuration for Nhost projects
 * Features:
 * - All React rules from react.mjs
 * - Next.js specific rules for optimizing performance
 * - Server component vs. client component rules
 * - Image, Link, and other Next.js component optimizations
 */
export default [
  ...reactConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Core Next.js rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-unwanted-polyfillio": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-title-in-document-head": "error",
      "@next/next/no-script-component-in-head": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-css-tags": "error",
      
      // Next.js component specific rules
      "@next/next/no-head-element": "error",
      "@next/next/google-font-display": "error",
      "@next/next/google-font-preconnect": "error",
      "@next/next/link-passhref": "error",
      "@next/next/no-styled-jsx-in-document": "error",
      
      // Server component rules
      "@next/next/no-before-interactive-script-outside-document": "error",
      
      // Performance rules
      "@next/next/inline-script-id": "error",
      "@next/next/no-assign-module-variable": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-duplicate-head": "error",
      
      // React specific adjustments for Next.js
      "react/react-in-jsx-scope": "off", // Next.js doesn't require React import
    },
  },
  {
    files: ["**/app/**/*.{ts,tsx}"],
    rules: {
      // Adjust rules for React Server Components
      "react-hooks/rules-of-hooks": "off", // Server components don't use hooks
      "react/function-component-definition": "off", // Allow for simpler RSC declaration
    },
  },
  {
    files: ["**/app/**/page.{ts,tsx}", "**/app/**/layout.{ts,tsx}"],
    rules: {
      // Export name requirements for Next.js conventions
      "import/no-default-export": "off",
      "import/prefer-default-export": "error",
    },
  },
  {
    files: ["**/app/**/**/client-*.{ts,tsx}", "**/app/**/**/**/use-*.{ts,tsx}"],
    rules: {
      // For files marked as client components, keep hook rules
      "react-hooks/rules-of-hooks": "error",
      "react/function-component-definition": ["error", { namedComponents: "arrow-function" }],
      // Add "use client" directive check
      "@next/next/no-missing-client-directive": "error",
    },
  },
];