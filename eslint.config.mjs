import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import regexp from 'eslint-plugin-regexp';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintConfigPrettier from 'eslint-config-prettier';
import comments from 'eslint-plugin-eslint-comments';

export default tseslint.config(
  // 1. Global Ignores (replacing .eslintignore)
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "coverage/**"]
  },

  // 2. Base Configurations (The "Extends" equivalent)
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylisticTypeChecked,
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-recommended"],
  regexp.configs["flat/recommended"],

  // Manual shim for eslint-comments (it doesn't have a native flat config export yet)
  {
    plugins: { "eslint-comments": comments },
    rules: { ...comments.configs.recommended.rules }
  },

  // 3. Shared Global Configuration
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    settings: {
      "import/resolver": { typescript: true }
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/triple-slash-reference": ["error", { path: "always" }],
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^Props$" }],
      "import/prefer-default-export": "off",
      "astro/jsx-a11y/label-has-associated-control": "off"
    }
  },

  // 4. Overrides for Astro files
  {
    files: ["**/*.astro"],
    // Astro plugin handles the parser automatically in the configs spread above,
    // we just need to specify the TS parser for the script tags inside.
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"]
      }
    },
    rules: {
      "import/no-unresolved": "off"
    }
  },

  // 5. Overrides for MJS files
  {
    files: ["**/*.mjs"],
    rules: {
      "no-console": "off",
      "import/no-extraneous-dependencies": "off"
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
);