import reactConfig from "./react.mjs";
import nextPlugin from "@next/eslint-plugin-next";

/**
 * Next.js specific ESLint configuration for Nhost projects
 * Features:
 * - All React rules from react.mjs
 * - Next.js recommended rules for best practices and performance
 * - Additional specific overrides for server components vs client components
 */
export default [
    ...reactConfig,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "@next/next": nextPlugin,
        },
        rules: {
            // Using Next.js recommended rules
            ...nextPlugin.configs.recommended.rules,

            // React specific adjustments for Next.js
            "react/react-in-jsx-scope": "off", // Next.js doesn't require React import

            // Elevate warnings to errors for critical Next.js rules
            "@next/next/no-html-link-for-pages": "error",
            "@next/next/no-img-element": "error",
            "@next/next/no-sync-scripts": "error",
            "@next/next/no-css-tags": "error",
            "@next/next/no-page-custom-font": "error",
            "@next/next/no-title-in-document-head": "error",
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
