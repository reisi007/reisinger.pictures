import { defineConfig } from "repomix";

export const AI_MJS_INSTRUCTION = `For any file modifications across multiple files, output a single \`import_gemini.mjs\` Node.js script to apply changes.
When writing \`.mjs\` scripts to modify files, use strict AST manipulation or exact string matching. Regex replacements for code are strictly forbidden.
Account for Windows (\`\\r\\n\`) vs Unix (\`\\n\`) line endings.
NEVER double-escape newlines (\`\\n\`) when injecting code via scripts.`;

export default defineConfig({
  output: {
    style: "markdown",
    filePath: "repomix-website.md",
    removeComments: false,
    removeEmptyLines: true,
    showLineNumbers: false,
    fileSummary: true,
    directoryStructure: true,
    headerText: AI_MJS_INSTRUCTION
  },
  include: [
    "*",
    "**/apps/**/*",
    "**/packages/**/**",
  ],
  ignore: {
    useGitignore: false,
    useDefaultPatterns: true,
    customPatterns: [
      "packages/tools/editor/editor.css",
      "packages/tools/human-loop/human-loop.css",
      "**/apps/*/.cache",
      "**/apps/*/.astro",
      "**/apps/*/dist",
      "favorites*.json",
      ".gitignore",
      "**/*.svg",
      "pnpm*.yaml"
    ]
  }
});