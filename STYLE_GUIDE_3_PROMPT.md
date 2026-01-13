# Gemini Pro 3 Prompt (Copy/Paste): Review https://ederma.co.za → Generate a Full Design Style Guide

This file contains a **single, detailed prompt** optimized for **Gemini Pro 3**. Paste it into Gemini to have it **review https://ederma.co.za** and then generate a **comprehensive design style guide** that you can use to **match the site’s style, theme, and layout** across pages (home, product, cart/checkout, account, etc.).

---

## Copy/Paste Prompt for Gemini Pro 3

You are a senior product designer + front-end design systems engineer. Your task is to review the live website **https://ederma.co.za** (including key page types such as home, PLP/category/listing, PDP/product detail, cart, checkout, account/login, search, CMS pages) and then produce a **comprehensive, implementation-ready design style guide** that enables another team to **faithfully recreate the same look & feel**.

### Primary Objective
Create a **complete design system + page template specification** that matches:
- Visual style (colors, type, spacing, borders, shadows, imagery)
- Layout (grid, containers, header/footer patterns, section spacing)
- Components (buttons, inputs, cards, product tiles, nav, mini-cart, etc.)
- Interaction patterns (hover/focus/active/disabled, transitions)
- Responsive behavior (mobile/tablet/desktop breakpoints)

### Output Requirements (Hard)
- Output **only Markdown**.
- Be **concrete and measurable**: provide values (hex colors, px sizes, line-heights, spacing numbers, radii, shadows, container widths).
- Include **tokens** and **usage rules** (what to use where).
- Include **page-by-page layout specs** (home, PDP, checkout, etc.) and identify shared template regions.
- Provide component specs with **states** (default/hover/focus/active/disabled/loading) and **accessibility** notes.
- Where exact values cannot be confirmed, clearly label them as **“estimate”** and provide a **confidence level** (high/medium/low).

### What You May Use As Inputs
You should rely on:
1) The live site at https://ederma.co.za
2) Any HTML snapshots and assets I provide (if available)
3) Your own careful inspection notes

If you cannot access the live site directly in your environment, then:
- Ask me for **HTML exports** (View Source saves), **screenshots**, or **CSS files**.
- Still produce a best-effort guide from the provided artifacts.

### Important: Extraction Method
When reviewing the site, follow this disciplined approach:

1) **Inventory pages (site map sampling)**
   - Identify representative URLs for:
     - Home
     - Category/collection/listing (PLP)
     - Product detail (PDP)
     - Cart
     - Checkout (step(s), payment, confirmation)
     - Account/login/register
     - Search results
     - Any editorial/CMS pages (about, shipping/returns, contact)

2) **Capture global tokens (Design Tokens Pass)**
   - Extract all recurring values:
     - Brand/primary color(s), secondary, neutrals
     - Typography families (including fallbacks), sizes, weights, letter-spacing
     - Spacing scale and vertical rhythm (section padding, gaps)
     - Border widths, radii (note if mostly square corners)
     - Shadows and elevation
     - Icon style (stroke vs filled, weight)
     - Motion (durations, easing)

3) **Layout analysis (Layout Pass)**
   - Determine:
     - Max container widths (e.g., 1220px / 1280px)
     - Grid system (12-col? product cards 4-up?)
     - Breakpoints and behavior at each breakpoint
     - Header patterns: sticky? height? nav structure? search behavior?
     - Footer patterns: columns, typography, background color

4) **Component analysis (Component Pass)**
   - For each component, specify:
     - Visual structure (padding, border, background, typography)
     - Variants (primary/secondary/text/ghost)
     - States (hover/focus/active/disabled/loading)
     - Any micro-interactions (image zoom, quick view, drawer)

5) **Page templates (Page Pass)**
   - For each page type, specify:
     - Regions and section order
     - Key modules (hero, promo banner, product grid, filters)
     - Standard spacing between sections
     - Content hierarchy and typography
     - Mobile behavior (collapse patterns, drawers)

### Deliverable Format (Your Markdown Must Follow This Structure)

#### 0) Executive Summary
- 5–10 bullets describing the aesthetic (e.g., “clinical luxury”, “sharp & flat”, “gold accent”, etc.)
- A “recreate this look” checklist

#### 1) Brand & Visual Principles
- Brand adjectives (3–7)
- Do/Don’t guidelines

#### 2) Design Tokens
Provide tokens as:
- Human-readable tables
- CSS variables
- A Tailwind extension snippet (even if approximate)

Include these token groups:
- **Color System**
  - Primary, primary-hover/active
  - Secondary/dark
  - Neutrals (at least 6 steps)
  - Semantic: success/warning/error/info
  - Background/surface/border
  - Link colors and visited/hover
  - Accessibility contrast notes

- **Typography System**
  - Font families + fallback stacks
  - Type scale (desktop + mobile adjustments)
  - Letter-spacing rules (especially nav/buttons if uppercase)
  - Heading styles (H1–H6), body, captions, overline

- **Spacing & Layout System**
  - Spacing scale in px
  - Section padding standards (top/bottom)
  - Container widths
  - Grid spec and gutters

- **Borders, Radius, Shadows**
  - Border thickness
  - Radius tokens (call out if 0px is default)
  - Shadow tokens (subtle dropdown shadows, etc.)

- **Motion**
  - Durations (fast/standard/slow)
  - Easing curve recommendations
  - Hover transition rules

#### 3) Core UI Components (Implementation-Ready Specs)
For each component below, include a mini-spec with:
- Anatomy
- Variants
- States
- Sizes
- Spacing (padding, gap)
- Typography
- Colors
- A11y notes (focus ring, contrast, hit area)

Components to cover (add more if present on the site):
- Buttons (primary/secondary/tertiary/text)
- Links
- Input fields (text, email, password)
- Select/dropdown
- Checkbox/radio
- Quantity stepper
- Search input + suggestions
- Tabs/accordions
- Breadcrumbs
- Pagination
- Toasts/alerts
- Badges (sale, discount, stock)
- Product card / product tile
- Price block (regular vs sale)
- Rating stars (if present)
- Header (nav, search, account, cart)
- Mini-cart drawer/modal
- Footer
- Modal / drawer
- Loading indicators/skeletons

#### 4) E-commerce Patterns
- PLP filters/sort (desktop sidebar vs mobile drawer)
- PDP gallery behavior (zoom, thumbnail layout)
- Variant selection (size/shade)
- Add-to-cart patterns
- Cart line item layout
- Checkout form layout + validation UI

#### 5) Page Templates (Per Page Type)
For each page type, provide:
- **Purpose**
- **Key modules in order**
- **Layout diagram (text-based)**
- **Grid + container**
- **Typography hierarchy**
- **Responsive notes**
- **Edge cases** (long titles, OOS, no results)

Page types to include:
- Home
- Category/PLP
- Search Results
- PDP/Product Detail
- Cart
- Checkout (steps)
- Order Confirmation
- Login/Register/Account
- CMS content page

#### 6) Imagery & Iconography
- Product image aspect ratios
- Background treatment
- Icon style (stroke width, corner style)
- Recommended icon library mapping (if replicating in React)

#### 7) Accessibility & Quality Bar
- Minimum contrast targets
- Focus states requirements
- Keyboard navigation expectations
- Form error messaging patterns

#### 8) “Build It” Appendix
- A Tailwind config “extend” example based on your tokens
- CSS variables block (`:root {}`)
- Quick mapping list: token → where used

### Verification Checklist (You Must Include At The End)
Provide a checklist to validate a rebuild matches the site:
- Color + typography match
- Container widths and grids match
- Button and input styling match
- PDP and checkout layout match
- Hover/focus interactions match
- Responsive behavior matches

### Constraints
- Do not invent a new design. Reverse-engineer the existing one.
- If multiple themes appear, document them and explain where each applies.

### Start Now
1) List the key URLs you reviewed.
2) Then produce the full guide in the required structure.
