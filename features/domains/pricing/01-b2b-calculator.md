---
domain: pricing
topic: b2b-calculator
status: active
---

# Technical Concept: B2B Pricing Builder

## 1. Pricing Logic
B2B pricing differs fundamentally from B2C. Instead of minute-by-minute sliders, it uses standard industry blocks.
- **Half-Day Rate (Halbtags):** Up to 4 hours.
- **Full-Day Rate (Ganztags):** Up to 8 hours.
- **Custom/Hourly:** Fallback for smaller corporate shoots (e.g., 1-3 hours).

## 2. Post-Production & Delivery Add-ons
- **Live-Delivery (Portal):** Premium surcharge for real-time IPTC delivery during the event via the custom SaaS portal.
- **Flatrate Buyout:** Full commercial usage rights included by default in B2B.

## 3. UI Component (`src/solid/CustomPricingBuilderB2B.tsx`)
- Implemented in SolidJS.
- **Presets (Buttons):** "Halber Tag" and "Ganzer Tag" that auto-adjust the sliders/calculations.
- **Toggle:** "Live-Content Portal Setup" (Adds specific flat fee).
- Output generates a pre-filled mailto/contact link formatted for business inquiries.
