---
domain: architecture
topic: navigation-split
status: active
---

# Technical Concept: Navigation Split & Mobile Menu

## 1. Target Audience Separation
The main navigation must clearly differentiate between B2C and B2B intent to establish professional authority.
- **Privat (B2C):** Beauty, Akt, Pärchen, Hochzeiten (Moved from Pricing/Reportage).
- **Business (B2B):** Corporate Portraits, Event Reportage, Live-Content.
- **Sport:** Kept as a standalone credibility pillar (LASK, Black Wings).
- **General:** Kurse, Einblicke (Blog), Preise (Split internally).

## 2. Mobile Menu Refactoring
- **Current State:** Relies on a DaisyUI structure that takes up too much vertical space and feels cluttered.
- **Target State:** Use a lightweight, native Astro + Tailwind approach. A `<dialog>` element or a vanilla JS toggled full-screen overlay with Tailwind's `fixed inset-0`.
- **UX Goal:** Fast, responsive, no layout shifts, clearly separated B2B/B2C funnels even on mobile.
