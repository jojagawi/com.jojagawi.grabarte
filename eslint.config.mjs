import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPerfPlugin from "eslint-plugin-react-perf";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import reactPlugin from "eslint-plugin-react";

export default defineConfig([
  globalIgnores([".cache", "node_modules", "coverage", "public"]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tsPlugin,
      "react-perf": reactPerfPlugin,
      sonarjs: sonarjsPlugin,
      react: reactPlugin,
    },
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures:
          jsxA11y.configs.recommended.parserOptions?.ecmaFeatures || {},
        ecmaVersion: 2020,
        jsx: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // React plugin rules - compatible with flat config
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      // React Performance plugin rules
      "react-perf/jsx-no-new-object-as-prop": "warn",
      "react-perf/jsx-no-new-array-as-prop": "warn",
      "react-perf/jsx-no-new-function-as-prop": "warn",
      // SonarJS plugin rules
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/cognitive-complexity": "warn",
    },
  },
  {
    files: ["src/__generated__/types.ts"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
