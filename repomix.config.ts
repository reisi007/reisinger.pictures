import { defineConfig } from "repomix";

export const AI_MJS_INSTRUCTION = `For any file modifications across multiple files, output a single \`import_gemini.mjs\` Node.js script to apply changes.
When writing \`.mjs\` scripts to modify files, use strict AST manipulation or exact string matching. Regex replacements for code are strictly forbidden.
Account for Windows (\`\\r\\n\`) vs Unix (\`\\n\`) line endings.
NEVER double-escape newlines (\`\\n\`) when injecting code via scripts.`;

export default defineConfig({
  output: {
    style: "markdown",
    filePath: "out/repomix-output.md",
    removeComments: false,
    removeEmptyLines: true,
    showLineNumbers: false,
    fileSummary: true,
    directoryStructure: true,
    headerText: AI_MJS_INSTRUCTION
  },
  include: [
    "*",
    "src/**/*",
    "editor/*",
    "human-loop/*",
    "deployment/*",
    "context/"
  ],
  ignore: {
    useGitignore: false,
    useDefaultPatterns: true,
    customPatterns: [
      "editor/editor.css",
      "human-loop/human-loop.css",
      "favorites*.json",
      ".gitignore",
      "**/*.svg",
	  "pnpm*.yaml",
    ]
  }
});