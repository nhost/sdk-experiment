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
            
            // React refresh for HMR
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],

            // Additional React rules not in recommended set
            "react/boolean-prop-naming": ["error", { rule: "^(is|has)[A-Z]([A-Za-z0-9]?)+" }],
            "react/destructuring-assignment": ["error", "always"],
            "react/function-component-definition": ["error", { namedComponents: "arrow-function" }],
            "react/jsx-boolean-value": ["error", "never"],
            "react/jsx-fragments": ["error", "syntax"],
            "react/no-multi-comp": "error",
            "react/prop-types": "off", // We use TypeScript instead

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