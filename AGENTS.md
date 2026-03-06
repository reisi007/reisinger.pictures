# Architectural Guidelines & Best Practices

This document summarizes key architectural decisions and workflow rules for this project. All contributions and AI-generated code must adhere to these standards.

## 1. Language Policy

* **Technical Content**: All documentation, code, variable names, and comments must be written in **English**.
* **User Interface**: All user-facing strings, including menus, dialogs, labels, and general content, must be implemented in **German**.

---

## 2. AI Interaction & Workflow Guidelines

* **Full Code Output**: Always provide the complete, copy-pasteable code for any modified file. Avoid providing partial snippets or diffs.
* **Rule Update Exception**: When updating this guidelines file (`AGENTS.md`), only provide the specific new rules or sections to be added.
* **Proactive Rule Suggestion**: Suggest new rules whenever identifying recurring patterns or to try to avoid critical mistakes in the future.

## 3. Code Quality & Maintenance

* **Dead Code Removal**: Remove unused functions and styles entirely to keep the codebase clean.
* **Centralized Logic**: Math and calculation logic (e.g., pricing formulas) must reside in `src/content/pricing.ts` to ensure consistency between SSR and Client-side islands. Avoid duplicating logic inside UI components.

## 4. UI/UX Standards

* **Feedback**: Provide clear visual feedback for user interactions, such as toggles changing pricing tiers or feature lists.
* **Button Placement**: In Pricing Cards and custom builders, the CTA button must always be pushed to the bottom using Tailwind's `mt-auto` within a flex container for a consistent grid appearance.
* **Skeleton Policy**: Do not use loading skeletons for components that are server-side rendered (SSR) and have no external data dependencies. Rely on Astro's seamless hydration instead.

## 5. Frontend & Client-Side Interactivity

* **Styling**: Strictly use Tailwind CSS (v4) and DaisyUI. Do not write custom CSS in `<style>` blocks or separate files.
* **Folder Structure**:
  * **Layouts**: Static Astro components and page wrappers reside in `src/layouts/`.
  * **Reactive Islands**: Framework-specific components (SolidJS) must be placed in `src/solid/` to clearly separate them from static Astro logic.
* **Technology Choice**:
  * **Vanilla JS**: Use for simple DOM enhancements, third-party library wrappers (e.g., PhotoSwipe), and basic UI toggles.
  * **SolidJS**: Use exclusively for complex, state-driven UI (e.g., configurators, calculators) where declarative rendering is superior to imperative DOM manipulation.
* **Hydration Strategy**:
  * Use **`client:visible`** for all components below the fold to optimize PageSpeed and TBT.
  * Use **`client:load`** only for critical interactive elements in the header or top section.
  * Use **`client:only`** only if browser-only APIs are strictly required and SSR is impossible.

## 6. Content & Images

* **ResponsiveImage**: NEVER use standard `<img>` or Astro's `<Image>`. Always use the custom `ResponsiveImage.astro` for optimization, EXIF handling, and responsive breakpoints.
* **Content Collections**: Manage all data via collections and update Zod schemas in `src/content/config.ts` accordingly.
* **JSON Collections ID**: Astro requires an `id` field in JSON content collection arrays for identification, but this `id` MUST NOT be explicitly defined in the Zod schema (`config.ts`). Astro handles it automatically.

## 7. MDX & Markup Standards

* **Class Attribute**: In MDX files, always use the standard HTML `class` attribute for CSS classes. Do not use `className`, as the project's MDX integration and Astro components expect standard HTML attribute naming.