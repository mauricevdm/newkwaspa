# Gemini Pro 3 Prompt (Copy/Paste): Implement the Ederma Style Guide in This Repo

Use this prompt in **Gemini 3 Pro** after you have a completed style guide Markdown (generated using STYLE_GUIDE_3.md’s “review website → style guide” prompt). This prompt is optimized to turn that guide into **concrete code changes** in this project’s **Next.js 14 + Tailwind** frontend.

---

## Copy/Paste Prompt for Gemini Pro 3

You are a senior front-end engineer and design systems specialist. Your job is to **implement the attached style guide** (tokens, components, page templates, interactions) in my existing Next.js + Tailwind project so the UI matches https://ederma.co.za as closely as possible.

### Inputs You Will Receive
I will provide these inputs below in this chat:
1) **STYLE GUIDE (SOURCE OF TRUTH)**: A comprehensive Markdown style guide for https://ederma.co.za (colors, typography, spacing, components, page templates, effects). Treat this as canonical.
2) **REPO CONTEXT**: Key project files (Tailwind config, globals.css, layout components, and representative pages).

### Project Context (You Must Follow)
- Framework: **Next.js App Router**
- Styling: **TailwindCSS** + **globals.css** layers + some shadcn-style components
- Frontend root: `frontend/`

Key files you will edit:
- `frontend/tailwind.config.ts` (theme tokens)
- `frontend/src/app/globals.css` (CSS variables, base styles, reusable utility classes)
- `frontend/src/app/layout.tsx` (site-wide fonts + root layout)
- Layout components:
  - `frontend/src/components/layout/header/header.tsx`
  - `frontend/src/components/layout/header/promo-banner.tsx`
  - `frontend/src/components/layout/footer/footer.tsx`
- Core UI components (shadcn-style):
  - `frontend/src/components/ui/button.tsx`
  - `frontend/src/components/ui/input.tsx`
  - `frontend/src/components/ui/card.tsx`
  - `frontend/src/components/ui/badge.tsx`
  - and other files in `frontend/src/components/ui/` if needed
- Page routes to align to the style guide’s page templates:
  - Home: `frontend/src/app/page.tsx`
  - PLP: `frontend/src/app/(shop)/products/page.tsx`
  - PDP: `frontend/src/app/(shop)/products/[slug]/page.tsx` and `frontend/src/app/(shop)/products/[slug]/product-details.tsx`
  - Cart: `frontend/src/app/(checkout)/cart/page.tsx` (and its client component if present)
  - Checkout: `frontend/src/app/(checkout)/checkout/page.tsx`
  - Checkout success: `frontend/src/app/(checkout)/checkout/success/page.tsx`
  - Auth: `frontend/src/app/(auth)/login/page.tsx`, `frontend/src/app/(auth)/register/page.tsx`
  - Account: `frontend/src/app/(account)/account/page.tsx`

### Non‑Negotiables
- **Do not redesign**. Implement the style guide exactly.
- Prefer **central tokens** over ad-hoc Tailwind classes.
- Remove/replace “off-brand” colors (example: hard-coded teal classes in checkout) with guide-aligned tokens.
- Match the guide’s **corner radius philosophy** (e.g., if it’s 0px, enforce it across components).
- Match **hover/focus/active** states and **motion** (durations/easing) across UI.
- Keep changes **minimal but complete**: implement the guide without refactoring unrelated logic.

### Deliverable (What You Must Output)
Output must be **implementation instructions + code changes**, in this exact format:

1) **Implementation Plan (short)**
   - 5–10 steps max

2) **Patch Set**
   - Provide a separate section per file:
     - `FILE: <path>`
     - Then provide a unified diff style patch:
       - Use `diff` blocks (```diff)
       - Include only the changed portions (don’t paste whole files)

3) **Verification Checklist**
   - A checklist mapped to pages: Home, PLP, PDP, Cart, Checkout, Auth, Account

If you think a new helper file is needed (e.g., `frontend/src/lib/design-tokens.ts` or a `styles/tokens.css`), you may add it, but keep additions minimal.

### Implementation Strategy (Follow This Order)
#### Phase A — Tokens & Foundations
1) Update Tailwind theme tokens to match the style guide:
   - Colors (brand primary, hover/active, secondary/dark, neutrals scale, semantic states)
   - Typography families (including fallbacks)
   - Container max width and padding
   - Border radius tokens (e.g., set `--radius` to the guide value)
   - Shadows and motion tokens (if represented as utilities)

2) Update `globals.css`:
   - Define `:root` CSS variables per the guide
   - Base typography (body, headings) to match weights/letter-spacing
   - Global focus ring style matching the guide
   - Define reusable component utility classes (optional) if the guide relies on them

#### Phase B — Core Components
Update shadcn-style components so the whole app inherits the right look:
- Buttons: primary/secondary/outline/text, uppercase + letter-spacing if specified, radius, border, hover/focus/disabled
- Inputs/selects: borders, focus, placeholder color, height, radius
- Cards: border/shadow/radius
- Badges: sale/stock/promo style

Important: implement guide states consistently:
- Hover: background/border/text change
- Focus: outline/ring (match guide)
- Disabled: opacity + cursor + color treatment
- Loading: spinner alignment

#### Phase C — Layout Shell (Header/Footer)
Update:
- Header height, stickiness, background, border/shadow on scroll
- Desktop nav typography: uppercase, letter-spacing, hover color
- Promo banner styling (background, text)
- Footer background and link styling

#### Phase D — Page Templates (Per Page)
For each page type, implement the template from the guide:
- Home (`frontend/src/app/page.tsx`): section spacing, typography hierarchy, CTA styles
- PLP: product grid columns per breakpoint, filter/sort layout
- PDP (`product-details.tsx`): gallery layout, tabs/accordion styles, price block, add-to-cart row
- Cart: layout + summary card + line item styling
- Checkout: stepper styling, form layout, order summary, remove teal/rounded-lg if guide says sharp corners
- Auth & Account: form layout, typography

### Specific Current Problems You Must Fix While Implementing
These are examples of misalignment you should correct *if the guide requires it*:
- Checkout uses hard-coded teal classes (`bg-teal-600`, `focus:ring-teal-500`) — replace with guide tokens.
- Many elements use `rounded-lg` — if the guide specifies sharp corners, enforce 0px/none.
- Ensure container width matches the guide (e.g., if guide says `1222px`, implement it).

### Responsive Requirements
For each major page:
- Provide desktop/tablet/mobile behavior
- Ensure touch targets meet minimum sizes
- Ensure nav/filter behaviors match the guide (e.g., mobile filter drawer)

### Accessibility Requirements
- Preserve keyboard navigation
- Ensure visible focus states on interactive elements
- Ensure color contrast meets WCAG AA where possible

---

## STYLE GUIDE (SOURCE OF TRUTH)
PASTE THE FULL STYLE GUIDE MARKDOWN HERE.

---

## REPO CONTEXT
PASTE ANY ADDITIONAL FILE SNIPPETS / NOTES HERE (if needed).

---

## Start Now
1) Briefly restate the site’s visual principles from the style guide (max 6 bullets).
2) Produce the Implementation Plan.
3) Produce the Patch Set, file by file.
4) Provide the Verification Checklist.
