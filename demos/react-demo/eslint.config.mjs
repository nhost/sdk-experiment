import reactConfig from "../../configs/eslint/react.mjs";
import jsonConfig from "../../configs/eslint/json.mjs";

export default [
  ...reactConfig,
  ...jsonConfig,
  {
    // React demo specific ignores
    ignores: ["dist", "build", "node_modules", ".vite", "coverage"],
  },
  {
    // Override TypeScript parser options to fix project file issues
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },
  },
  {
    // React demo specific rules
    files: ["src/**/*.tsx"],
    rules: {
      // Allow props spreading in the demo for simplicity
      "react/jsx-props-no-spreading": "off",
      // Downgrade from error to warning for demo purposes
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
