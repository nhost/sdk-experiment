import js from "@eslint/js";
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
    languageOptions: {
      parser: jsonPlugin,
    },
    rules: {
      "json/json": ["error", { allowComments: false }],
      "json/duplicate-key": "error",
      "json/undefined": "error",
      "json/format": [
        "error",
        {
          indentSize: 2,
          indentType: "space",
        },
      ],
    },
  },
];