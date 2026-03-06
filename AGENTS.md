# Architectural Guidelines & Best Practices

This document summarizes key architectural decisions and workflow rules for this project. All contributions and AI-generated code must adhere to these standards.

**Language Policy:** All documentation, code, and comments must be in **English**. User interface strings (menus, dialogs, labels) must be implemented in the **project's target language** (e.g.,
German).

---

## 1. AI Interaction & Workflow Guidelines

* **Full Code Output:** Always provide the complete, copy-pasteable code for any modified file. Avoid providing partial snippets or diffs, as this forces manual merging.
* **Rule Update Exception:** When updating this guidelines file (`AGENTS.md`), only provide the specific new rules or sections to be added, not the entire document.
* **Proactive Rule Suggestion:** The AI is expected to proactively suggest new rules, architectural guidelines, or workflow improvements for this document whenever it identifies recurring patterns or
  potential pitfalls. Keep the document as concise as possible.

## 2. Code Quality

* **Code Cleanliness:** Do not leave empty functions, obsolete code blocks, or placeholder comments.
* **Dead Code Removal:** Remove unused functions and all their corresponding calls entirely to keep the codebase clean and maintainable.

## 3. UI/UX & Form Handling Standards

* **Explicit User Feedback:** Provide explicit feedback (e.g., optional success or mandatory failure messages) for user interactions like form submissions.
* **Input Validation:** Clearly handle optional vs. mandatory fields. Validate mandatory fields before attempting form submissions.

## 4. Frontend & Styling (Astro & Tailwind)

* **Styling Framework:** Strictly use Tailwind CSS (v4) utility classes and DaisyUI components for styling. Do not write custom CSS in `<style>` blocks or separate `.css` files unless solving a highly
  specific edge case (e.g., third-party library overrides).
* **Component Preference:** Prefer standard Astro components (`.astro`) for UI structure. Keep the frontend as Zero-JS as possible. If client-side interactivity is required, prefer vanilla JavaScript
  within native `<script>` tags over heavy UI frameworks.
* **Image Handling:** NEVER use standard HTML `<img>` tags or Astro's native `<Image>` component for content images. Always use the custom `ResponsiveImage.astro` component to ensure proper
  optimization, EXIF data handling, and responsive breakpoints via `sizeModifiers`.

## 5. Content & SEO Management

* **Content Collections:** All structured data (Markdown, YAML, JSON) must be managed via Astro Content Collections. Whenever adding a new frontmatter property or metadata field, you MUST update the
  corresponding Zod schema in `src/content/config.ts`.
* **SEO & Structured Data:** Every new page or layout must integrate `BaseHead.astro` for meta tags and open graph images. Furthermore, strictly implement `SchemaOrg.astro` utilizing the factories in
  `SchemaOrg.factory.ts` to generate valid JSON-LD structured data.

## 6. TypeScript & Linting

* **Type Safety:** Maintain strict TypeScript compliance. Do not use `any`. Always declare explicit interfaces or types for component `Props` and function payloads.
* **Imports:** The project uses `simple-import-sort`. Ensure all imported modules are correctly named and available, knowing that the linter will handle the final alphabetical and grouping sort.