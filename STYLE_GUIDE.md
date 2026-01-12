# Dermastore Complete Style Guide

## Table of Contents
1. [Brand Overview](#brand-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Imagery Guidelines](#imagery-guidelines)
7. [Voice & Tone](#voice--tone)
8. [Accessibility](#accessibility)

---

## Brand Overview

### Brand Identity
**Dermastore** is a specialist online skincare store backed by leading dermatologists, focusing on premium, science-backed skincare products.

### Brand Values
- **Expertise**: Medical-grade, dermatologist-backed products
- **Trust**: Clinical studies and professional recommendations
- **Premium Quality**: Top-tier international brands
- **Customer Care**: Personalized consultations and support
- **Innovation**: Evidence-based skincare solutions

### Target Audience
- Health-conscious consumers aged 25-55
- Individuals seeking professional skincare solutions
- People with specific skin concerns (aging, acne, pigmentation, sensitivity)
- Premium product seekers who value quality over price

---

## Color Palette

### Primary Colors

#### Brand Primary
```css
--primary-teal: #008B8B;          /* Main brand color - headers, CTAs */
--primary-teal-light: #20B2AA;    /* Hover states, accents */
--primary-teal-dark: #006666;     /* Active states, depth */
```

#### Neutral Base
```css
--white: #FFFFFF;                 /* Backgrounds, cards */
--gray-50: #F9FAFB;              /* Light backgrounds */
--gray-100: #F3F4F6;             /* Borders, dividers */
--gray-200: #E5E7EB;             /* Disabled states */
--gray-300: #D1D5DB;             /* Subtle borders */
--gray-400: #9CA3AF;             /* Placeholder text */
--gray-500: #6B7280;             /* Secondary text */
--gray-600: #4B5563;             /* Body text */
--gray-700: #374151;             /* Headings */
--gray-800: #1F2937;             /* Primary text */
--gray-900: #111827;             /* Emphasis text */
--black: #000000;                /* Maximum contrast */
```

### Secondary Colors

#### Accent Colors
```css
--accent-coral: #FF6B6B;         /* Sale tags, urgency */
--accent-gold: #FFD700;          /* Premium badges, highlights */
--accent-green: #10B981;         /* Success messages, in-stock */
--accent-blue: #3B82F6;          /* Info, links */
--accent-pink: #F472B6;          /* Beauty/feminine touches */
```

#### Semantic Colors
```css
--success: #10B981;              /* Success states */
--success-light: #D1FAE5;        /* Success backgrounds */
--warning: #F59E0B;              /* Warning states */
--warning-light: #FEF3C7;        /* Warning backgrounds */
--error: #EF4444;                /* Error states */
--error-light: #FEE2E2;          /* Error backgrounds */
--info: #3B82F6;                 /* Info states */
--info-light: #DBEAFE;           /* Info backgrounds */
```

### Background Colors
```css
--bg-primary: #FFFFFF;           /* Main content areas */
--bg-secondary: #F9FAFB;         /* Alternate sections */
--bg-tertiary: #F3F4F6;          /* Cards, modules */
--bg-overlay: rgba(0,0,0,0.5);   /* Modals, overlays */
```

### Color Usage Guidelines

1. **Primary Teal**: Use for main CTAs, navigation highlights, brand elements
2. **Coral Accent**: Limited use for sales, urgency, special offers
3. **Gold**: Premium product badges, VIP features, loyalty programs
4. **Neutrals**: 60% of interface (backgrounds, text, borders)
5. **Accents**: 10% maximum per page for emphasis

---

## Typography

### Font Families

#### Primary Font Stack
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```
*Modern, clean, highly readable for body text and UI elements*

#### Secondary Font (Headings)
```css
--font-headings: 'Playfair Display', Georgia, 'Times New Roman', serif;
```
*Elegant serif for main headings to convey premium quality*

#### Monospace (Code, SKU)
```css
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
```

### Type Scale

#### Desktop
```css
--text-xs: 12px;        /* line-height: 16px */  /* Labels, captions */
--text-sm: 14px;        /* line-height: 20px */  /* Small text, metadata */
--text-base: 16px;      /* line-height: 24px */  /* Body text */
--text-lg: 18px;        /* line-height: 28px */  /* Lead paragraphs */
--text-xl: 20px;        /* line-height: 28px */  /* Subheadings */
--text-2xl: 24px;       /* line-height: 32px */  /* Section headings */
--text-3xl: 30px;       /* line-height: 36px */  /* Page titles */
--text-4xl: 36px;       /* line-height: 40px */  /* Hero headings */
--text-5xl: 48px;       /* line-height: 1 */     /* Display headings */
--text-6xl: 60px;       /* line-height: 1 */     /* Large displays */
```

#### Mobile (Scale down)
```css
--text-3xl-mobile: 24px;
--text-4xl-mobile: 30px;
--text-5xl-mobile: 36px;
--text-6xl-mobile: 48px;
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Typography Usage

#### Headings
```css
h1 {
  font-family: var(--font-headings);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: 1.2;
  color: var(--gray-900);
}

h2 {
  font-family: var(--font-headings);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: 1.3;
  color: var(--gray-800);
}

h3 {
  font-family: var(--font-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: 1.4;
  color: var(--gray-800);
}

h4 {
  font-family: var(--font-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  line-height: 1.5;
  color: var(--gray-700);
}
```

#### Body Text
```css
body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: 1.6;
  color: var(--gray-700);
}

.lead-text {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: 1.7;
  color: var(--gray-600);
}

.small-text {
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--gray-500);
}
```

---

## Spacing & Layout

### Spacing Scale
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

### Container Widths
```css
--container-sm: 640px;    /* Small content */
--container-md: 768px;    /* Medium content */
--container-lg: 1024px;   /* Standard pages */
--container-xl: 1280px;   /* Wide layouts */
--container-2xl: 1536px;  /* Maximum width */
```

### Breakpoints
```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large desktop */
```

### Grid System
- **Desktop**: 12-column grid
- **Tablet**: 8-column grid
- **Mobile**: 4-column grid
- **Gutter**: 24px (desktop), 16px (tablet), 12px (mobile)

### Common Spacing Patterns

#### Section Padding
- Desktop: 80px top/bottom, 24px left/right
- Tablet: 60px top/bottom, 20px left/right
- Mobile: 40px top/bottom, 16px left/right

#### Card Padding
- Large: 32px
- Medium: 24px
- Small: 16px

#### Element Margins
- Between sections: 64px
- Between components: 32px
- Between elements: 16px
- Between related items: 8px

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--primary-teal);
  color: var(--white);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-teal-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 139, 139, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--primary-teal);
  border: 2px solid var(--primary-teal);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: var(--font-semibold);
}

.btn-secondary:hover {
  background: var(--primary-teal);
  color: var(--white);
}
```

#### Button Sizes
- **Large**: 48px height, 20px 32px padding
- **Medium**: 40px height, 12px 24px padding
- **Small**: 32px height, 8px 16px padding
- **Tiny**: 28px height, 6px 12px padding

#### Button States
- Default: Primary color
- Hover: Lighter shade + lift
- Active: Darker shade + press
- Disabled: Gray-300 + reduced opacity (0.5)
- Loading: Show spinner, disable interaction

### Input Fields

```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  font-size: var(--text-base);
  color: var(--gray-800);
  transition: border-color 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-teal);
  box-shadow: 0 0 0 3px rgba(0, 139, 139, 0.1);
}

.input-field:error {
  border-color: var(--error);
}

.input-field::placeholder {
  color: var(--gray-400);
}
```

### Cards

#### Product Card
```css
.product-card {
  background: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}
```

**Structure**:
- Image container (aspect-ratio: 3/4)
- Badge overlay (sale, new, etc.)
- Product info section (padding: 16px)
  - Brand name (text-sm, gray-500)
  - Product name (text-base, font-medium)
  - Rating stars
  - Price (text-lg, font-semibold)
  - "Add to Cart" button

#### Content Card
```css
.content-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-sale {
  background: var(--accent-coral);
  color: var(--white);
}

.badge-new {
  background: var(--accent-gold);
  color: var(--gray-900);
}

.badge-bestseller {
  background: var(--primary-teal);
  color: var(--white);
}
```

### Navigation

#### Header
- Height: 80px (desktop), 64px (mobile)
- Background: White with subtle shadow
- Logo: Left-aligned
- Search: Center (desktop), expandable (mobile)
- Icons: Right-aligned (account, wishlist, cart)
- Sticky: Yes, with reduced height on scroll

#### Mega Menu
- Triggered on hover (desktop)
- Full-width dropdown
- Product categories with images
- Featured products section
- Promotional banners

### Forms

#### Form Groups
```css
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
}

.form-help-text {
  margin-top: 6px;
  font-size: var(--text-xs);
  color: var(--gray-500);
}

.form-error {
  margin-top: 6px;
  font-size: var(--text-xs);
  color: var(--error);
}
```

### Modals

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}

.modal-content {
  background: var(--white);
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

### Loading States

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Tooltips

```css
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: var(--white);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: var(--text-xs);
  white-space: nowrap;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## Imagery Guidelines

### Photography Style

#### Product Photography
- **Background**: Pure white (#FFFFFF)
- **Lighting**: Soft, even lighting with minimal shadows
- **Angle**: Front view (primary), multiple angles for detail views
- **Resolution**: Minimum 2000px on longest side
- **Format**: WebP (primary), JPEG (fallback)
- **Aspect Ratio**: 3:4 (portrait) for consistency

#### Lifestyle Photography
- **Style**: Clean, minimal, aspirational
- **Color Grading**: Natural tones with slight warmth
- **Composition**: Rule of thirds, negative space
- **Models**: Diverse ages, skin types, genders
- **Context**: Premium environments, natural lighting

### Image Specifications

#### Homepage Hero
- Desktop: 1920x800px (2.4:1)
- Mobile: 768x1024px (3:4)
- File size: < 300KB (optimized)

#### Product Images
- Main: 2000x2667px (3:4)
- Thumbnail: 400x533px (3:4)
- Zoom: 3000x4000px (3:4)

#### Category Banners
- Desktop: 1920x600px
- Mobile: 768x512px
- File size: < 200KB

#### Blog/Content Images
- Featured: 1200x630px (1.91:1) - OG image compatible
- In-content: 800px width maximum
- File size: < 150KB

### Icons
- **Style**: Line icons, 2px stroke weight
- **Size**: 24x24px standard, scale proportionally
- **Format**: SVG (preferred), PNG retina (@2x)
- **Color**: Inherit from parent or use gray-600 as default

---

## Voice & Tone

### Brand Voice Attributes

1. **Expert & Trustworthy**
   - Use scientific terminology appropriately
   - Reference clinical studies and dermatologist recommendations
   - Provide evidence-based information

2. **Approachable & Caring**
   - Use "you" and "your" to create connection
   - Show empathy for skin concerns
   - Offer personalized solutions

3. **Premium but Accessible**
   - Professional language without being pretentious
   - Educate without overwhelming
   - Balance sophistication with clarity

4. **Confident & Reassuring**
   - Definitive statements backed by expertise
   - Positive, solution-focused messaging
   - Clear calls-to-action

### Writing Guidelines

#### Product Descriptions
- Start with key benefit
- Include hero ingredients
- Explain how it works
- Specify skin types/concerns
- End with usage instructions

#### Microcopy
- Buttons: Action-oriented ("Add to Cart", "Shop Now", "Get Started")
- Errors: Helpful and solution-focused ("Email required. Please enter your email address.")
- Success: Celebratory but brief ("Added to cart!")
- Placeholders: Provide clear examples ("e.g., name@email.com")

#### Tone Variations
- **Homepage**: Inspirational, welcoming
- **Product Pages**: Informative, persuasive
- **Checkout**: Clear, reassuring
- **Account Area**: Friendly, helpful
- **Help Center**: Educational, patient

---

## Accessibility

### WCAG 2.1 Level AA Compliance

#### Color Contrast
- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 against background

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators (2px outline, primary-teal)
- Logical tab order
- Skip links for main content

#### Screen Readers
- Semantic HTML5 elements
- ARIA labels for icon buttons
- Alt text for all images (descriptive, not "image of")
- Form labels associated with inputs
- Clear heading hierarchy

#### Typography
- Minimum 16px base font size
- Maximum line length: 80 characters
- Line height: 1.5 minimum for body text
- Text can be resized up to 200% without loss of functionality

#### Interactive Elements
- Touch targets: Minimum 44x44px
- Clear hover and focus states
- Visible disabled states
- Error messages associated with form fields

#### Motion & Animation
- Respect `prefers-reduced-motion` media query
- No auto-playing videos with sound
- Provide pause controls for carousels
- Animations < 5 seconds or provide control

### Accessibility Checklist

- [ ] All images have appropriate alt text
- [ ] Color is not the only means of conveying information
- [ ] Forms have associated labels
- [ ] Focus indicators are visible
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Interactive elements are keyboard accessible
- [ ] Error messages are clear and helpful
- [ ] Videos have captions
- [ ] Page title is descriptive
- [ ] Language is specified in HTML

---

## Design Principles

### 1. Clarity First
Every element should have a clear purpose. Remove unnecessary complexity.

### 2. Consistency
Use established patterns. Don't reinvent common interactions.

### 3. Feedback
Provide immediate visual feedback for all user actions.

### 4. Progressive Disclosure
Show only what's necessary. Reveal complexity gradually.

### 5. Error Prevention
Design to prevent errors before they happen, not just handle them gracefully.

### 6. Mobile-First
Design for mobile, enhance for desktop. Touch-friendly targets.

### 7. Performance
Fast loading is a feature. Optimize images, lazy load, minimize JS.

### 8. Trust & Credibility
Security indicators, social proof, professional presentation build trust.

---

## Responsive Design Guidelines

### Mobile (< 768px)
- Single column layouts
- Full-width components
- Hamburger menu navigation
- Simplified product grids (1-2 columns)
- Stack elements vertically
- Larger touch targets (44px minimum)

### Tablet (768px - 1024px)
- 2-3 column layouts
- Adaptive navigation (may remain hamburger or expand)
- Product grids (2-3 columns)
- Side-by-side content blocks

### Desktop (> 1024px)
- Multi-column layouts (up to 4 columns for products)
- Full horizontal navigation
- Mega menus
- Product grids (3-4 columns)
- Side-by-side with rich details

---

## Animation & Transitions

### Timing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Duration
- Micro-interactions: 150ms
- Standard transitions: 200-300ms
- Complex animations: 400-500ms
- Page transitions: 300-400ms

### Common Animations

#### Hover Effects
- Scale: 1.05 (subtle lift)
- Shadow: Increase depth
- Color: Lighten/darken 10%
- Duration: 200ms

#### Page Load
- Fade in: Opacity 0 → 1
- Slide up: Transform translateY(20px) → 0
- Stagger: Delay children by 50ms

#### Loading States
- Skeleton screens
- Spinner (circular, primary-teal)
- Progress bars for multi-step processes

---

## Best Practices Summary

### Do's ✓
- Use white space generously
- Maintain consistent spacing rhythm
- Provide clear visual hierarchy
- Optimize images for web
- Test on real devices
- Follow accessibility guidelines
- Use semantic HTML
- Provide clear feedback
- Write descriptive alt text
- Keep forms simple and clear

### Don'ts ✗
- Don't use too many font families (max 2-3)
- Don't rely on color alone for meaning
- Don't use small touch targets (< 44px)
- Don't auto-play videos with sound
- Don't hide important information
- Don't use all caps for long text
- Don't disable zoom on mobile
- Don't remove focus indicators
- Don't use vague error messages
- Don't sacrifice performance for aesthetics

---

**Version**: 1.0  
**Last Updated**: January 7, 2026  
**Maintained By**: Dermastore Design Team
