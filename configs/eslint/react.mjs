import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import baseConfig from "./base.mjs";

/**
 * React specific ESLint configuration for Nhost projects
 * Features:
 * - React best practices using recommended rulesets
 * - React Hooks rules
 * - JSX accessibility
 * - React performance optimizations
 * - Custom TypeScript conventions for React
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
            // React recommended rules
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs['jsx-runtime'].rules,

            // React hooks
            ...reactHooks.configs.recommended.rules,
        },
    },
];
