import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import parser from "astro-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  extends: compat.extends(
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:eslint-comments/recommended",
    "plugin:regexp/recommended",
    "prettier"
  ),

  plugins: {
    "simple-import-sort": simpleImportSort
  },

  languageOptions: {
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      project: true,
      extraFileExtensions: [".astro"]
    }
  },

  settings: {
    "import/resolver": {
      typescript: true
    }
  },

  rules: {
    "@typescript-eslint/triple-slash-reference": ["error", {
      path: "always"
    }],
    "@typescript-eslint/no-unused-vars": ["error", {
      varsIgnorePattern: "^Props$"
    }],
    "import/prefer-default-export": "off"
  }
}, {
  files: ["**/*.astro"],

  languageOptions: {
    parser: parser,
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      parser: "@typescript-eslint/parser"
    }
  },

  rules: {
    "import/no-unresolved": "off"
  }
}, {
  files: ["**/*.mjs"],

  rules: {
    "no-console": "off",
    "import/no-extraneous-dependencies": "off"
  }
}, {
  files: ["**/*.tsx", "**/*.ts"],

  rules: {
    "prefer-destructuring": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"]
  }
}]);