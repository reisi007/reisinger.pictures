import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import regexp from "eslint-plugin-regexp";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier";
import comments from "@eslint-community/eslint-plugin-eslint-comments";

export default [
  // 1. Global Ignores
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "coverage/**"]
  },

  // 2. Base Configurations
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylisticTypeChecked,
  ...astro.configs.recommended,
  regexp.configs["flat/recommended"],

  // Manual shim for eslint-comments
  {
    plugins: { "@eslint-community/eslint-comments": comments },
    rules: { ...comments.configs.recommended.rules }
  },

  // 3. Shared Global Configuration
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/triple-slash-reference": ["error", { path: "always" }],
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^Props$" }]
    }
  },

  // 4. Overrides for Astro files
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"]
      }
    }
  },

  // 5. Overrides for MJS files
  {
    files: ["**/*.mjs"],
    rules: {
      "no-console": "off"
    }
  },

  // 6. Overrides for TS/TSX files
  {
    files: ["**/*.tsx", "**/*.ts"],
    rules: {
      "prefer-destructuring": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"]
    }
  },

  // 7. Prettier (Always last to override formatting rules)
  eslintConfigPrettier
];