# Design Style Guide: Ederma

This guide reflects a **"Clinical Luxury"** aesthetic—blending the scientific trust of dermatology with the premium feel of high-end skincare.

---

### **1. Color Palette**
The palette is minimal, using a specific gold hue to denote "premium" status against a clean medical white/slate background.

| Token | Hex | Tailwind Class (Approx) | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `#dabf7a` | `bg-[#dabf7a]` | Primary buttons (Add to Cart), Active states, Icons. |
| **Primary Hover** | `#b5aa6f` | `hover:bg-[#b5aa6f]` | Hover state for primary buttons. |
| **Secondary** | `#28353d` | `bg-slate-800` | Footer background, Alternate dark buttons. |
| **Heading Text** | `#242424` | `text-gray-900` | Section titles, Product names. |
| **Body Text** | `#777777` | `text-gray-600` | Descriptions, Metadata. |
| **Success** | `#459647` | `text-green-600` | Stock status, Success messages. |
| **Surface** | `#ffffff` | `bg-white` | Main background, Cards. |
| **Border/Divider** | `#e6e6e6` | `border-gray-200` | Card borders, Separators. |

**CSS Variables:**
```css
:root {
  --color-primary: #dabf7a;
  --color-secondary: #28353d;
  --color-text-main: #242424;
  --color-text-body: #777777;
  --color-bg-light: #f7f7f7;
}
```

---

### **2. Typography**
The typography reinforces the "Medical" + "Personal" brand duality using a clean sans-serif paired with a handwritten script.

*   **Primary Font**: `Lato` (Google Font)
    *   **Usage**: All headings, body text, buttons, and navigation.
    *   **Weights**:
        *   `400` (Regular) - Body text.
        *   `700` (Bold) - Headings, Navigation, Buttons.
*   **Accent Font**: `Satisfy`
    *   **Usage**: "Dermatologist" signatures, gentle overlay text.
*   **Secondary Font**: `Open Sans` (Occasional usage in sliders).

**Type Scale (Desktop):**
*   **H1**: 32px - 40px / Bold
*   **H2 / Section Title**: 24px - 28px / Bold
*   **H3 / Product Title**: 16px - 18px / Bold
*   **Body**: 14px / Regular / 1.6 Line Height
*   **Nav/Button**: 13px / Bold / Uppercase / Widely letter-spaced

---

### **3. Spacing & Layout**
The layout follows a standard boxed container logic focusing on grid alignment for product catalogs.

*   **Container Max-Width**: `1222px`
*   **Grid System**: 12-column grid.
    *   **Products**: 4 columns (Desktop), 3 columns (Tablet), 2 columns (Mobile).
*   **Gaps**: `20px` (y-axis), `20px` (x-axis).
*   **Padding**: Generous vertical whitespace (`60px - 80px`) between sections to maintain a clean look.

**Tailwind Grid Example:**
```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
  {/* Product Cards */}
</div>
```

---

### **4. Components**
The design language is **Sharp & Flat**. There are almost no rounded corners (`border-radius: 0`), reinforcing a "precise" or "scientific" feel.

#### **Buttons**
*   **Style**: Rectangular, 0px border radius.
*   **Primary**: Gold background, White text, Uppercase.
*   **Secondary**: Light Gray (`#f7f7f7`) background, Dark text.
*   **Structure**: High horizontal padding (`px-6 py-3`).

#### **Inputs & Forms**
*   **Style**: Rectangular, 0px border radius.
*   **Border**: 1px solid light gray (`#e6e6e6`).
*   **Focus State**: Dark gray border (`#242424`) or subtle Gold ring. No heavy glows.
*   **Placeholder**: Light gray text (`#777777`).

#### **Badges & Labels**
*   **Sale/Discount**: Round or sharp tags in **Gold** or **Black**.
*   **Stock Status**: Green text (`#459647`) for "In Stock".
*   **Corner**: 0px for strict rectangular tags.

#### **Navigation**
*   **Bar**: Sticky, White background, subtle shadow on scroll.
*   **Links**: Uppercase `13px` texts, dark gray, turning Gold on hover.
*   **Layout**: Logo Center or Left, split navigation.

#### **Product Cards**
*   **Shape**: Rectangular `0px` radius.
*   **Style**: Clean white card. Minimal borders.
*   **Hover**: Image zoom effect or "Quick View" overlay. Use `group-hover` in Tailwind to trigger secondary image reveal.

---

### **5. Visual Style**
*   **Corner Radius**: **0px** (Strictly sharp).
*   **Shadows**: Minimal usage. Flat design takes precedence. Subtle shadows only appear on drop-downs or sticky headers.
*   **Icons**: Thin, stroke-based icons.
    *   **Recommendation**: Use `Lucide React` (e.g., `<ShoppingBag />`, `<User />`, `<Search />`) with `stroke-width={1.5}` to match the elegant, clinical aesthetic.
*   **Imagery**:
    *   Product images are predominantly on clean white backgrounds.
    *   Aspect Ratio: Square `1:1` or Portrait `3:4`.

---

### **6. Branding**
*   **Logo**: Minimalist text-based logo or simple medical cross/leaf iconography.
*   **Vibe**: Trustworthy, Experienced, Curated.
*   **Animations**: Minimal. Fast fades (`duration-200`) on hover states.

---

### **Recommendations for Improvement**

1.  **Accessibility (Contrast)**:
    *   The primary gold color (`#dabf7a`) on white text may have a low contrast ratio.
    *   **Fix**: Use a slightly darker gold (`#b59a58`) for text or ensure gold is only used as a background for black text, or strictly large white text.
2.  **Responsiveness**:
    *   Ensure tap targets for buttons are at least `44px` height on mobile.
3.  **Modernization**:
    *   While sharp edges are the brand style, a very subtle `rounded-sm` (2px) can sometimes feel less "harsh" on mobile displays while keeping the professional look.

### **Figma / Tailwind Tokens Reference**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#dabf7a',
          'gold-dark': '#b5aa6f',
          dark: '#28353d',
        },
        text: {
          primary: '#242424',
          secondary: '#777777',
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        signature: ['Satisfy', 'cursive'],
      },
      borderRadius: {
        'none': '0px', // Explicit default
      }
    }
  }
}
```
