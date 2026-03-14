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
* **Centralized Logic**: Math and calculation logic (e.g., pricing formulas) must reside in `src/content/pricing.ts` to ensure consistency between SSR and Client-side islands. Avoid duplicating logic
  inside UI components.

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
* **Content Collections**: Manage all data via collections and update Zod schemas in `src/content/content.config.ts` accordingly.
* **JSON Collections ID**: Astro requires an `id` field in JSON content collection arrays for identification, but this `id` MUST NOT be explicitly defined in the Zod schema (`content.config.ts`). Astro
  handles it automatically.

## 7. MDX & Markup Standards

* **Class Attribute**: In MDX files, always use the standard HTML `class` attribute for CSS classes. Do not use `className`, as the project's MDX integration and Astro components expect standard HTML
  attribute naming.

## 8. AI Content Curation & Human-in-the-Loop (HITL)

When tasks require subjective selection (e.g., choosing the best images for a gallery, selecting testimonials, or reviewing content proposals), we use a structured JSON-based HitL workflow to ensure
the human user retains creative control. The tool is located at `human-loop/reviewer.html`.

**Core Rules for AI Proposals:**

1. **Abundance of Choice:** The AI MUST provide a broad selection of options (usually 4-8) rather than just 1 or 2. This ensures the human has genuine alternatives to choose from.
2. **Rich Visual Context:** The AI MUST use original image paths from the repository to build the UI (e.g., `/src/images/testimonials/xyz/small.jpg`) so the user sees exactly what is being selected.

- Options can include `avatar_url` (for rounded profile pictures) and `image_url` (for large hero images) alongside `text`.

3. **Tool-First Approach:** If a new use case arises that the current `reviewer.html` utility does not perfectly support, the AI MUST propose an update to the utility's HTML/JS code FIRST, before
   trying to force a workaround.
4. **Proactive Proposals:** Whenever asked to curate content that heavily impacts design or marketing (images, reviews, hero-sections), the AI MUST offer to generate a `human-loop` JSON proposal
   FIRST, rather than just guessing and implementing blindly.

**Workflow Protocol:**

1. **AI Proposes:** The AI generates a JSON object formatted for the `human-loop/reviewer.html` tool. This JSON contains an array of `tasks` detailing the question, options (`id`, `label`, `text`,
   `avatar_url`, `image_url`), and `max_selections`.
2. **Human Reviews:** The user views the JSON in the Reviewer Tool (styled exactly like the real components), makes selections, *reorders them if order matters*, writes custom notes, or flags tasks.
3. **Human Responds:** The tool generates a response JSON containing the user's decisions (including the final array order).
4. **AI Implements:** The user feeds the response JSON back to the AI. The AI strictly applies the `selected_ids` in the exact array order provided, acknowledges `custom_input`, and updates the
   codebase.
5. **Strict Path Verification:** The AI MUST always cross-reference image slugs with the actual physical directory structure before assigning `image_url` or `avatar_url`. Keep in mind that `Images.ts`
   strips prefixes like `content-einblicke-` and `images-testimonials-`. The JSON must contain the exact, physical file path starting with `/src/...` (e.g.
   `/src/content/einblicke/beauty/valentina-herbst2025/valentina-baum.jpg`). Do not guess paths.
6. **Tool Readiness Check:** Before proposing any HITL JSON payload, the AI MUST verify if the `human-loop/reviewer.html` tool is fully functional. The tool MUST use the local `human-loop.css` for
   styling. Crucially, the tool MUST use **Inline SVGs** for all UI icons (drag handles, arrows, checks) rather than relying on external web fonts or dynamically generated Tailwind classes, to ensure
   they render reliably in standalone mode. Image preview elements MUST use `object-contain` and adequate height to prevent cropping, allowing the user to judge the full image. The tool MUST also
   include a textarea per task for `comment` / `custom_input` which gets passed to the final JSON output. Finally, the tool MUST feature dual JSON inputs: one for the "Base Tasks JSON" and one for an
   optional "State JSON" (responses) to restore previous selections.
7. **AI Proposes:** The AI generates a JSON object formatted for the `human-loop/reviewer.html` tool. This JSON contains an array of `tasks` detailing the question, options (`id`, `label`, `text`,
   `avatar_url`, `image_url`, `meta_info`), and `max_selections`. The AI MUST extract technical metadata (Aperture, Shutter, ISO, Focal Length, Title) from the `.yaml` files and provide it in the
   `meta_info` field.
8. **Hero Image Policy:** When prompting the user to select a "Hero Image", the AI MUST strongly prefer and explicitly suggest images that are in **Landscape Orientation (Querformat)**, as these fit
   best in banner positions, unless no suitable alternatives exist.
9. **Image Selection Volume & Motives:** When a user asks to review or select images for a component or page, the AI MUST provide a Human-in-the-Loop JSON payload. For 1-3 image slots, propose 10-20
   options per slot. For a larger number of slots, propose 4 times the amount of options per slot. The task object MUST use `label` for the title/name of the slot and `text` to explicitly define and
   describe the motive/purpose of the slot. The currently used image MUST always be included as the first option in the JSON array.

## 9. Deployment & Hosting Strategy

* **Architecture**: The project is a statically generated Astro site. Hosting is done via an Nginx container managed by Portainer.
* **Synchronization**: Do not introduce complex CI/CD pipelines (like GitHub Actions) unless explicitly requested. The deployment relies on local builds synced via `rclone` to the remote host machine (`/home/webadmin/websites/reisinger.pictures`).
* **Container Context**: The Nginx container maps the host directory as a read-only volume. Configuration regarding the Docker stack is kept in `deployment/docker-compose.yml`.
* **Publishing**: The complete build and sync cycle is orchestrated via the `npm run publish` script defined in `package.json`.