import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylistic,
    {
        // React demo specific ignores
        ignores: ["dist", "build", "node_modules", ".vite", "coverage", "vite.config.ts"],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
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
);
