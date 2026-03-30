# Architectural Guidelines, AI Rules & Best Practices

This document summarizes key architectural decisions, toolchains, and workflow rules for the `reisinger.pictures` website project. All contributions and AI-generated code must strictly adhere to these standards.

## 1. AI Agent Roles & Strict Definition of Done (DoD)
We enforce a strict separation of concerns via `AGENTS.todo.md`. An agent must fulfill its specific DoD before completing a turn.
* **Role 1: Planner Agent ("Architect")**
    * **Goal:** Define target state and estimate effort. Update/create Markdown docs in `/features/` (if applicable) or plan the architecture.
    * **DoD:** Concept documented. Actionable tasks appended to `AGENTS.todo.md`.
* **Role 2: Implementation Agent ("Maker")**
    * **Goal:** Execute the top unassigned `[ ] TODO` from `AGENTS.todo.md`.
    * **DoD:** Code is written. Task status changed to `(Ready for Review)`.
* **Role 3: Review Agent ("Checker")**
    * **Goal:** Quality assurance.
    * **DoD:** Code validated. Zero tolerance for workarounds. Task checked off `[x]` in `AGENTS.todo.md`. If failed, change to `(Needs Fix)`.
* **Silent TODO Rule:** Do not log or display TODOs in the chat that you create and immediately complete.

## 2. Code Output & Script Generation (Node.js/MJS)
This project heavily relies on `.mjs` scripts for automation (e.g., `manage_favorites.mjs`, `merge-content.mjs`, `add-metadata.mjs`).
* **Full Code Output:** Always provide the complete, copy-pasteable code for any modified Astro/TS/TSX file.
* **Scripting Rule (CRITICAL):** For complex file modifications across multiple files, output a single `import_gemini.mjs` Node.js script to apply changes.
* **No Regex Rule (CRITICAL):** When writing `.mjs` scripts to modify files, use strict AST manipulation or exact string matching. Regex replacements for code are strictly forbidden.
* **Robust File Patching:** Account for Windows (`\r\n`) vs Unix (`\n`) line endings.
* **Escaping Rule:** NEVER double-escape newlines (`\n`) when injecting code via scripts.

## 3. Language Policy & Code Quality
* **Language:** Technical Content (Code, Docs, Variables, Comments) = **English**. User Interface (Strings, Menus, Content) = **German**.
* **Centralized Logic:** Math and calculation logic (e.g., pricing formulas) MUST reside in `src/content/pricing.ts` to ensure consistency between SSR and Client-side islands. Do not duplicate logic.
* **Dead Code:** Remove unused functions and styles entirely.

## 4. Frontend & Architectural Standards
* **Styling:** Strictly use Tailwind CSS (v4) and DaisyUI. Do not write custom CSS in `<style>` blocks.
* **Component Separation:** * Static UI & Layouts: `.astro` components in `src/layouts/`.
    * Reactive Islands: `.tsx` components using **SolidJS** must be placed in `src/solid/`. Do not use React.
* **Hydration Strategy:**
    * Use `client:visible` for all SolidJS components below the fold.
    * Use `client:load` only for critical interactive elements at the top.
* **UI/UX:** Provide clear feedback (Toasts). CTA buttons in cards must be pushed to the bottom using `mt-auto`. No loading skeletons for SSR components.
* **Images:** NEVER use standard `<img>`. Always use the custom `ResponsiveImage.astro` for EXIF handling, responsive sizes, and optimization.

## 5. Local Toolchain: Metadata Editor
The project uses a custom local tool to manage image metadata (IPTC/YAML) safely.
* **Tool:** `editor/editor.html` (served locally) powered by `editor/editor-api-key.js`.
* **Automation:** The `add-metadata.mjs` script extracts EXIF data from JPGs, generates `.yaml` files, and prepares them for the editor.
* **Rule:** Do not manually hardcode EXIF data into YAML files. Use the provided `.mjs` scripts and the editor UI.

## 6. AI Content Curation & Human-in-the-Loop (HITL)
When tasks require subjective selection (e.g., curating images or testimonials), we use a structured JSON-based HitL workflow tool located at `human-loop/human-loop.html` (or `reviewer.html`).
1. **Abundance of Choice:** Propose 4-8 options per slot.
2. **Visual Context:** Use actual repository image paths (`/src/images/...`) for `image_url` or `avatar_url` so the human sees the exact asset.
3. **Task Definition:** Use `label` for the slot name and `text` for the motive/purpose.
4. **Format:** The AI proposes a `favorites_hitl.json` (or similar). The human reviews it in the HTML tool and returns a response JSON. The AI strictly applies the `selected_ids` in the exact order returned.
5. **Readiness Check:** Ensure the HTML tool uses Inline SVGs (no external fonts) and provides textareas for `comment`.

## 7. Deployment & Hosting Strategy
* **Architecture:** SSG Astro site, hosted via Nginx in a Portainer Docker stack.
* **Sync:** Deployment relies on local builds synced via `rclone`.
* **Publishing:** The complete build and sync cycle is orchestrated via `npm run publish`. Do not introduce GitHub Actions CI/CD unless explicitly requested.