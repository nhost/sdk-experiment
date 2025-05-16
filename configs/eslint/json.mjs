import jsonPlugin from "@eslint/json";

/**
 * JSON specific ESLint configuration for Nhost projects
 * Features:
 * - JSON validation
 * - Consistent formatting
 * - Error detection
 */
export default [
    {
        files: ["**/*.json"],
        plugins: { json: jsonPlugin },
        language: "json/json",
        rules: {
            "json/no-duplicate-keys": "error",
            "json/no-empty-keys": "error",
            "json/no-unsafe-values": "error",
        },
    },
];
