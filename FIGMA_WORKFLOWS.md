# Dermastore Figma Workflows & Design System

## Table of Contents
1. [Figma File Structure](#figma-file-structure)
2. [Design System Setup](#design-system-setup)
3. [Page Workflows](#page-workflows)
4. [User Journeys](#user-journeys)
5. [Component Library](#component-library)
6. [Prototyping Guidelines](#prototyping-guidelines)
7. [Handoff Documentation](#handoff-documentation)

---

## Figma File Structure

### Recommended File Organization

```
📁 Dermastore E-commerce Platform
├── 📄 00 - Design System
│   ├── Color Styles
│   ├── Text Styles
│   ├── Effect Styles (shadows, blurs)
│   ├── Grid Styles
│   └── Spacing Documentation
├── 📄 01 - Components Library
│   ├── Atoms (buttons, inputs, icons)
│   ├── Molecules (cards, forms, navigation)
│   ├── Organisms (headers, footers, product grids)
│   └── Templates (page layouts)
├── 📄 02 - Desktop Screens (1920x1080)
│   ├── Homepage
│   ├── Shop & Categories
│   ├── Product Details
│   ├── Cart & Checkout
│   └── Account Pages
├── 📄 03 - Tablet Screens (768x1024)
│   └── All key screens adapted
├── 📄 04 - Mobile Screens (375x667)
│   └── All key screens adapted
├── 📄 05 - User Flows
│   ├── Purchase Journey
│   ├── Account Creation
│   ├── Search & Discovery
│   └── Returns & Support
├── 📄 06 - Prototypes
│   ├── Desktop Interactive Prototype
│   ├── Mobile Interactive Prototype
│   └── Tablet Interactive Prototype
└── 📄 07 - AI/ML Features
    ├── Skin Analysis Tool
    ├── Product Recommendations
    ├── Virtual Try-On
    └── Chatbot Interface
```

---

## Design System Setup

### 1. Color Styles

Create the following color styles in Figma:

#### Brand Colors
- `Primary/Teal/Default` - #008B8B
- `Primary/Teal/Light` - #20B2AA
- `Primary/Teal/Dark` - #006666

#### Neutrals
- `Neutral/White` - #FFFFFF
- `Neutral/Gray/50` - #F9FAFB
- `Neutral/Gray/100` - #F3F4F6
- `Neutral/Gray/200` - #E5E7EB
- `Neutral/Gray/300` - #D1D5DB
- `Neutral/Gray/400` - #9CA3AF
- `Neutral/Gray/500` - #6B7280
- `Neutral/Gray/600` - #4B5563
- `Neutral/Gray/700` - #374151
- `Neutral/Gray/800` - #1F2937
- `Neutral/Gray/900` - #111827
- `Neutral/Black` - #000000

#### Accent Colors
- `Accent/Coral` - #FF6B6B
- `Accent/Gold` - #FFD700
- `Accent/Green` - #10B981
- `Accent/Blue` - #3B82F6
- `Accent/Pink` - #F472B6

#### Semantic Colors
- `Semantic/Success` - #10B981
- `Semantic/Success/Light` - #D1FAE5
- `Semantic/Warning` - #F59E0B
- `Semantic/Warning/Light` - #FEF3C7
- `Semantic/Error` - #EF4444
- `Semantic/Error/Light` - #FEE2E2
- `Semantic/Info` - #3B82F6
- `Semantic/Info/Light` - #DBEAFE

### 2. Text Styles

#### Headings (Playfair Display)
- `Heading/H1/Desktop` - 36px, Bold, 40px line height
- `Heading/H1/Mobile` - 30px, Bold, 36px line height
- `Heading/H2/Desktop` - 30px, Semibold, 36px line height
- `Heading/H2/Mobile` - 24px, Semibold, 32px line height
- `Heading/H3` - 24px, Semibold, 32px line height
- `Heading/H4` - 20px, Medium, 28px line height

#### Body (Inter)
- `Body/Large` - 18px, Regular, 28px line height
- `Body/Base` - 16px, Regular, 24px line height
- `Body/Small` - 14px, Regular, 20px line height
- `Body/XSmall` - 12px, Regular, 16px line height

#### UI Text
- `UI/Button/Large` - 16px, Semibold, 24px line height
- `UI/Button/Medium` - 14px, Semibold, 20px line height
- `UI/Button/Small` - 12px, Semibold, 16px line height
- `UI/Label` - 14px, Medium, 20px line height
- `UI/Caption` - 12px, Regular, 16px line height

### 3. Effect Styles

#### Shadows
- `Shadow/Small` - 0px 1px 3px rgba(0,0,0,0.1)
- `Shadow/Medium` - 0px 4px 12px rgba(0,0,0,0.1)
- `Shadow/Large` - 0px 10px 25px rgba(0,0,0,0.15)
- `Shadow/XLarge` - 0px 20px 50px rgba(0,0,0,0.3)

#### Focus States
- `Focus/Primary` - 0px 0px 0px 3px rgba(0,139,139,0.1)
- `Focus/Error` - 0px 0px 0px 3px rgba(239,68,68,0.1)

### 4. Grid Styles

#### Desktop (1920px)
- 12 columns
- 72px margins
- 24px gutter

#### Tablet (768px)
- 8 columns
- 32px margins
- 16px gutter

#### Mobile (375px)
- 4 columns
- 16px margins
- 12px gutter

---

## Page Workflows

### 1. Homepage Workflow

#### Frame: Desktop Homepage (1920 x 4000)

**Components to Design:**

1. **Top Announcement Bar** (1920 x 40)
   - Rotating messages
   - "Free delivery on orders over R750"
   - Close button (right)

2. **Main Header** (1920 x 80)
   - Logo (left) - 180x50px
   - Search bar (center) - 600px width
   - Icons (right): Account, Wishlist, Cart with badge
   - Main navigation below: Shop, Brands, Concerns, About, Contact

3. **Hero Carousel** (1920 x 800)
   - Auto-rotating slides (3-5 slides)
   - Large product image (right) - 800x800px
   - Content area (left):
     - Eyebrow text (12px, uppercase, teal)
     - Headline (48px, Playfair Display)
     - Description (18px, 2 lines max)
     - CTA button (primary)
   - Dots navigation (bottom center)
   - Arrow navigation (left/right edges)

4. **Featured Categories** (1920 x 600)
   - Section heading "Shop by Concern"
   - 6 category cards in grid (3 columns x 2 rows)
   - Each card: Image, title, product count, CTA link
   - Hover effect: lift + shadow

5. **Featured Products** (1920 x 800)
   - Section heading "Bestsellers"
   - 4 product cards in row
   - Product card details:
     - Product image (400x533)
     - Brand name
     - Product name (2 lines max, ellipsis)
     - Star rating (5 stars)
     - Price (current + was price if on sale)
     - Quick view button (on hover)
     - Add to cart button
     - Wishlist icon (top right)
     - Badge (Sale/New) if applicable

6. **Benefits Bar** (1920 x 200)
   - 4 columns
   - Icon + heading + short description
   - Benefits: Free Delivery, Expert Advice, Secure Payment, Easy Returns

7. **Brand Showcase** (1920 x 600)
   - "Shop Top Brands"
   - Scrolling carousel of brand logos
   - 8 visible at a time
   - Click to filter shop by brand

8. **Editorial Section** (1920 x 600)
   - 2 columns
   - Left: Large image + "Skin Tips" content
   - Right: Blog post list (3 articles)
   - Each article: Thumbnail, title, excerpt, read more

9. **Instagram Feed** (1920 x 600)
   - Section heading "Follow @dermastoresa"
   - 6 Instagram images in grid
   - Hover shows likes/comments
   - CTA: Follow button

10. **Newsletter Signup** (1920 x 400)
    - Background image with overlay
    - Center-aligned content
    - Heading + description
    - Email input + Subscribe button
    - Privacy policy link

11. **Footer** (1920 x 500)
    - 4 columns:
      1. About + Social links
      2. Shop By Range (links)
      3. Customer Experience (links)
      4. About Us (links)
    - Bottom bar: Copyright, payment icons, security badges

**Interactions:**
- Sticky header on scroll (reduced height: 60px)
- Hero auto-advance (5s intervals)
- Product quick view opens modal
- Add to cart shows confirmation toast
- Search with autocomplete suggestions

---

### 2. Product Listing Page (Shop/Category)

#### Frame: Shop Page (1920 x 3000)

**Components:**

1. **Header** (same as homepage)

2. **Breadcrumb Navigation** (1920 x 50)
   - Home > Shop > [Category Name]

3. **Page Header** (1920 x 200)
   - Category name (H1)
   - Category description (2-3 lines)
   - Optional: Category hero image background

4. **Filter & Sort Bar** (1920 x 80)
   - Left: "Filter" button (opens sidebar)
   - Active filters displayed as removable chips
   - Right: Sort dropdown (Best Selling, Price Low-High, etc.)
   - Results count: "Showing 48 of 240 products"

5. **Filter Sidebar** (320 x auto) [Slide-in on mobile]
   - Categories (collapsible)
   - Brands (checkboxes, search field)
   - Price Range (dual slider)
   - Skin Type (checkboxes)
   - Concerns (checkboxes)
   - Ingredients (checkboxes)
   - Rating (star filters)
   - In Stock toggle
   - Apply & Clear buttons

6. **Product Grid** (1280 x auto)
   - 4 columns on desktop
   - 3 columns on tablet
   - 2 columns on mobile
   - Product cards (same as homepage)
   - Lazy load more on scroll

7. **Pagination** (1920 x 80)
   - Page numbers (1, 2, 3... 10)
   - Previous/Next buttons
   - Jump to page input

**Interactions:**
- Filter sidebar slides in from left
- Filters update URL for shareability
- Products fade in as they load
- Quick view modal
- Infinite scroll option (A/B test vs pagination)

---

### 3. Product Detail Page

#### Frame: Product Page (1920 x 5000)

**Components:**

1. **Header** (same as homepage)

2. **Breadcrumb** (1920 x 50)
   - Home > Shop > [Category] > [Product Name]

3. **Product Main Section** (1920 x 800)
   
   **Left Column (900px):**
   - Main product image (700x933)
   - Thumbnail gallery (below, 5 images scrollable)
   - Zoom on hover
   - Lightbox on click
   
   **Right Column (900px):**
   - Brand name (linked)
   - Product name (H1)
   - Star rating + review count (clickable)
   - Price (large, bold)
   - Size/variant selector (if applicable)
   - Quantity selector
   - Add to Cart button (large, primary)
   - Add to Wishlist button (secondary)
   - "Ask a Therapist" button (opens chat)
   - Short benefits list (4-5 bullet points with icons)
   - Key ingredients
   - Free delivery banner (if qualifies)
   - Delivery estimate
   - Security badges (secure checkout, etc.)

4. **Tabs Section** (1920 x 800)
   - Tab navigation: Details | Ingredients | How to Use | Reviews
   
   **Details Tab:**
   - Full product description
   - Benefits (expanded)
   - For best results (usage tips)
   - Suitable for skin types
   
   **Ingredients Tab:**
   - Full ingredient list (INCI names)
   - Hero ingredients highlighted with explanations
   
   **How to Use Tab:**
   - Step-by-step instructions
   - Visual aids
   - Routine placement
   
   **Reviews Tab:**
   - Overall rating summary
   - Rating breakdown (5 to 1 stars)
   - Filter reviews (Most Recent, Highest Rating, etc.)
   - Review cards with: Rating, name, date, verified badge, review text, helpful votes
   - Write a Review button

5. **AI Recommendations Section** (1920 x 600)
   - "Complete Your Routine" - AI-powered suggestions
   - 4 complementary products in carousel
   - Reason for recommendation shown
   - Add all to cart option

6. **Frequently Bought Together** (1920 x 400)
   - Current product + 2 related products
   - Bundle price saving shown
   - Add bundle to cart button

7. **Recently Viewed** (1920 x 600)
   - Carousel of products user viewed
   - 6 products visible

**Interactions:**
- Image gallery zoom and lightbox
- Sticky add-to-cart bar on scroll (mobile)
- Size selector updates price
- Reviews load more on scroll
- AI recommendations personalized
- Tabs deep-linkable

---

### 4. Shopping Cart Page

#### Frame: Cart Page (1920 x 1200)

**Components:**

1. **Header** (same as homepage)

2. **Page Title** (1920 x 100)
   - "Shopping Cart" (H1)
   - Item count

3. **Cart Layout** (2 columns)
   
   **Left Column - Cart Items (1200px):**
   - Cart item rows:
     - Product image (100x133)
     - Product details: Brand, name, size/variant
     - Price (per unit)
     - Quantity selector (- , number, +)
     - Subtotal (price x quantity)
     - Remove button (X icon)
   - Free sample selector (if eligible)
   - Promo code input + Apply button
   - Continue shopping link
   
   **Right Column - Summary (600px):**
   - "Order Summary" heading
   - Subtotal
   - Delivery (with threshold progress: "Add R250 for free delivery")
   - Discount (if applied)
   - Total (large, bold)
   - Proceed to Checkout button (primary, large)
   - Security badges
   - Accepted payment methods icons
   - Returns policy summary

4. **You May Also Like** (1920 x 600)
   - 4 recommended products
   - Based on cart contents

**Interactions:**
- Quantity update refreshes prices instantly
- Remove item shows undo toast
- Free delivery progress bar animates
- Promo code validates on apply
- Add sample opens modal selection

---

### 5. Checkout Flow

#### Frame: Checkout (1920 x 2000)

**Multi-step checkout:**

**Step 1: Contact & Delivery**
- Email input (with guest checkout option)
- Delivery address form:
  - Full name
  - Phone number
  - Street address
  - Suburb
  - City
  - Province (dropdown)
  - Postal code
- Save address checkbox (for logged-in users)
- Delivery method selection:
  - Standard (3-5 business days) - FREE over R750
  - Express (1-2 business days) - R150
- Continue to Payment button

**Step 2: Payment**
- Order summary (collapsible on mobile)
- Payment method selection:
  - Credit/Debit Card
  - Instant EFT
  - PayFast
  - Mobicred (buy now, pay later)
- Card details form (or redirect for other methods)
- Billing address (same as delivery checkbox)
- Place Order button

**Step 3: Confirmation**
- Order number
- Thank you message
- Order summary
- Delivery timeline
- Email confirmation sent message
- Track order button
- Continue shopping button

**Progress Indicator:**
- Top of page showing: Cart > Information > Payment > Confirmation
- Current step highlighted

**Interactions:**
- Form validation on blur
- Address autocomplete (Google Places API)
- Payment method changes form fields
- Real-time order summary update
- Secure connection indicator

---

### 6. Account Dashboard

#### Frame: My Account (1920 x 2000)

**Sidebar Navigation (300px):**
- Profile picture + name
- Dashboard (home icon)
- Orders
- Addresses
- Wishlist
- Loyalty Points
- Consultations
- Settings
- Logout

**Main Content Area (1520px):**

**Dashboard View:**
- Welcome message
- Quick stats cards:
  - Total orders
  - Loyalty points
  - Wishlist items
  - Active consultations
- Recent orders (3 most recent)
- Recommended products
- Upcoming consultations

**Orders View:**
- Order history table/list
- Filters: All, Processing, Shipped, Delivered, Cancelled
- Each order:
  - Order number
  - Date
  - Status badge
  - Items preview (images)
  - Total
  - View Details / Track / Reorder buttons

**Order Detail Modal:**
- Order status timeline
- Items with images and details
- Delivery address
- Payment method
- Order summary
- Download invoice
- Contact support
- Return items button

**Interactions:**
- Sidebar active state
- Orders filterable and searchable
- Track order shows real-time tracking
- Reorder adds items to cart
- Download invoice generates PDF

---

### 7. Search Results Page

#### Frame: Search Results (1920 x 2500)

**Components:**

1. **Search Header** (1920 x 150)
   - "Search results for '[query]'"
   - Results count
   - Did you mean suggestion (if typo detected)

2. **Search Tabs** (1920 x 60)
   - All Results
   - Products (count)
   - Brands (count)
   - Articles (count)
   - Ingredients (count)

3. **Results Section:**
   
   **All Results View:**
   - Top Match (1 featured product)
   - Products (grid, 4 columns)
   - Related Brands (logos)
   - Related Articles (cards)
   
   **Products View:**
   - Same as product listing page
   - Filters available

4. **No Results State:**
   - "No results found for '[query]'"
   - Search suggestions
   - Popular categories
   - Popular products

**AI Features:**
- Auto-correct spelling
- Synonym matching
- Natural language understanding ("best for dry skin")
- Visual search option (search by image)

---

### 8. AI/ML Enhanced Features

#### 8.1 Virtual Skin Analysis Tool

**Frame: Skin Analysis (1920 x 2500)**

**Flow:**

**Step 1: Introduction**
- Feature explanation
- Privacy notice (data handling)
- Upload or Capture photo button
- Sample result preview

**Step 2: Photo Capture**
- Camera view (if device has camera)
- Guidelines overlay (face positioning)
- Capture button
- Or upload from device

**Step 3: Analysis Processing**
- Loading animation
- "Analyzing your skin..." message
- Progress indicators (Detecting, Analyzing, Generating Report)

**Step 4: Results Dashboard**

Left Column:
- Your photo (with annotation overlay)
- Detected areas highlighted:
  - Fine lines/wrinkles
  - Dark spots/hyperpigmentation
  - Pores
  - Redness/sensitivity
  - Dryness/dehydration

Right Column:
- Overall skin score (gauge 0-100)
- Detected concerns (list with severity)
- Skin type determination
- Age estimate vs actual age

**Step 5: Recommendations**
- Personalized routine builder
- Product recommendations per concern
- Before/after simulations
- Add to cart options
- Save results to account
- Schedule consultation button

**Design Notes:**
- Minimalist, clinical aesthetic
- Use of data visualization (charts, gauges)
- Clear privacy messaging
- Educational tooltips
- Progress saving

---

#### 8.2 AI Chatbot Interface

**Component: Chat Widget (400 x 600)**

**Collapsed State:**
- Floating button (bottom right)
- Icon: Chat bubble with notification dot
- Subtle pulse animation

**Expanded State:**

**Header (400 x 80):**
- "Skin Therapist" title
- Status: Online
- Minimize/Close buttons

**Chat Area (400 x 440):**
- Message bubbles:
  - Bot messages (left, gray background)
  - User messages (right, teal background)
- Typing indicator (animated dots)
- Quick reply chips (suggested responses)
- Product cards (rich messages)
- Timestamp (subtle)

**Input Area (400 x 80):**
- Text input field
- Emoji button
- Attachment button (photo upload)
- Send button

**Features:**
- Product search integration
- Order status lookup
- Appointment booking
- Knowledge base integration
- Handoff to human agent
- Suggested questions
- Multi-language support

**AI Capabilities:**
- Natural language understanding
- Sentiment analysis
- Context retention
- Product recommendations
- Skin concern diagnosis
- Routine building

---

#### 8.3 Smart Product Recommendations

**Component: Recommendation Widget**

**Locations:**
- Homepage (personalized for you)
- Product pages (complete your routine)
- Cart (frequently bought together)
- Post-purchase (reorder reminders)

**Card Layout:**
- Product image
- Brand + name
- Price
- Star rating
- "Why we recommend this" explanation
- Quick add button

**Recommendation Types:**

1. **Collaborative Filtering:**
   - "Customers who bought this also bought..."
   
2. **Content-Based:**
   - "Similar to products you've viewed"
   
3. **Routine Completion:**
   - "Complete your morning routine"
   - Shows missing steps with recommendations
   
4. **Replenishment:**
   - "Time to restock?"
   - Based on purchase history and typical usage

5. **Trending:**
   - "What's popular right now"
   - Real-time trending products

**Design:**
- Carousel format (4-6 visible)
- Arrows for navigation
- Smooth scroll/slide animation
- Skeleton loading states

---

## User Journeys

### Journey 1: First-Time Visitor to Purchase

**Steps:**

1. **Landing** (Homepage)
   - User arrives via Google search
   - Hero carousel showcases current promotion
   - Scrolls to see categories and products

2. **Discovery** (Category Page)
   - Clicks "Shop by Concern" > "Anti-Aging"
   - Views product grid
   - Applies filters (price range, brand)

3. **Research** (Product Page)
   - Clicks product card
   - Views images and reads details
   - Checks reviews
   - Sees AI recommendations

4. **Decision** (Product Page)
   - Clicks "Add to Cart"
   - Sees confirmation toast
   - Continues shopping (cart badge updates)

5. **Additional Item** (Recommended)
   - Adds recommended serum
   - Views cart via header icon

6. **Checkout** (Cart > Checkout)
   - Reviews cart items
   - Proceeds to checkout
   - Enters details as guest
   - Completes payment

7. **Confirmation** (Order Confirmed)
   - Sees success message
   - Receives email
   - Option to create account

**Screen Flow:**
Homepage → Category → Product → Cart → Checkout (Info) → Checkout (Payment) → Confirmation

---

### Journey 2: Returning Customer - Quick Reorder

**Steps:**

1. **Login** (Homepage)
   - Clicks "Sign In"
   - Enters credentials
   - Redirects to Dashboard

2. **Order History** (My Account > Orders)
   - Views past orders
   - Finds previous order
   - Clicks "Reorder"

3. **Cart** (Cart Page)
   - Items added automatically
   - Reviews and updates quantities
   - Proceeds to checkout

4. **Checkout** (Expedited)
   - Saved address auto-filled
   - Saved payment method selected
   - One-click purchase

5. **Confirmation** (Order Confirmed)
   - Success message
   - Loyalty points earned notification

**Screen Flow:**
Dashboard → Orders → Cart → Checkout → Confirmation

---

### Journey 3: Skin Analysis to Personalized Routine

**Steps:**

1. **Discovery** (Homepage/Banner)
   - Sees "Free Skin Analysis" banner
   - Clicks CTA

2. **Introduction** (Skin Analysis Landing)
   - Reads about feature
   - Clicks "Start Analysis"

3. **Photo Upload** (Analysis Tool)
   - Uploads selfie or takes photo
   - Submits for analysis

4. **Processing** (Loading)
   - Waits for AI analysis (15-20 seconds)
   - Engaging loading animation

5. **Results** (Analysis Dashboard)
   - Reviews skin concerns detected
   - Sees skin score
   - Reads detailed breakdown

6. **Recommendations** (Routine Builder)
   - Views personalized product recommendations
   - Sees complete routine (AM/PM)
   - Understands rationale for each product

7. **Shopping** (Add to Cart)
   - Adds recommended products
   - Applies bundle discount
   - Proceeds to checkout

8. **Account Creation** (Checkout)
   - Creates account to save analysis results
   - Completes purchase

**Screen Flow:**
Homepage → Skin Analysis Intro → Upload → Processing → Results → Recommendations → Cart → Checkout → Confirmation

---

### Journey 4: Research & Consultation

**Steps:**

1. **Research** (Blog/Product Page)
   - Reads article about retinol
   - Clicks "Shop Retinol Products"

2. **Uncertainty** (Product Page)
   - Unsure which product is right
   - Clicks "Ask a Therapist"

3. **Chat** (Chatbot)
   - Describes skin concern
   - Chatbot asks qualifying questions
   - Provides initial recommendations

4. **Escalation** (Live Chat)
   - Requests human expert
   - Connected to skin therapist
   - Discusses concerns in detail

5. **Booking** (Consultation)
   - Therapist suggests video consultation
   - Books appointment via chat
   - Adds to calendar

6. **Consultation** (Video Call)
   - Scheduled video consultation
   - Expert provides personalized advice
   - Recommends products

7. **Follow-up** (Email)
   - Receives email with recommendations
   - Clicks product links
   - Completes purchase

**Screen Flow:**
Blog → Product → Chat → Consultation Booking → Video Call → Email → Product Page → Cart → Checkout

---

## Component Library

### Atoms

#### Buttons
- **Primary Button**: Teal background, white text, rounded corners
- **Secondary Button**: Teal border, teal text, transparent background
- **Text Button**: No border, teal text, underline on hover
- **Icon Button**: Circle or square, icon only, hover state
- **Sizes**: Small (32px), Medium (40px), Large (48px)
- **States**: Default, Hover, Active, Disabled, Loading

#### Input Fields
- **Text Input**: Border, focus ring, error state
- **Textarea**: Multi-line, resize handle
- **Select Dropdown**: Chevron icon, options list
- **Checkbox**: Custom styled, checked state, indeterminate
- **Radio Button**: Custom styled, selected state
- **Toggle Switch**: On/off states, smooth animation
- **Search Input**: Magnifying glass icon, clear button

#### Icons
- **Set**: Feather Icons or similar line icon set
- **Size**: 16px, 20px, 24px, 32px
- **Style**: 2px stroke, rounded corners
- **Color**: Inherit from parent or gray-600 default

#### Badges & Tags
- **Badge**: Small, rounded, colored background
- **Tag**: Similar to badge, removable (X icon)
- **Status Indicator**: Dot + text (online, offline, etc.)

#### Images
- **Placeholder**: Gray background, icon centered
- **Aspect Ratios**: 1:1, 3:4, 16:9, 2.4:1
- **Border Radius**: 8px standard

---

### Molecules

#### Product Card
- Image container (aspect ratio 3:4)
- Badge overlay (sale, new)
- Wishlist heart icon (top right)
- Brand name
- Product name (2 lines, ellipsis)
- Star rating
- Price (current + was price)
- Quick view button (hover)
- Add to cart button

#### Search Bar
- Input field
- Search icon (left)
- Clear button (right, appears on input)
- Autocomplete dropdown:
  - Recent searches
  - Suggested products
  - Suggested categories
  - Popular searches

#### Navigation Menu Item
- Link text
- Chevron indicator (if has submenu)
- Mega menu dropdown:
  - Multi-column layout
  - Images + text links
  - Featured products
  - Promotional banner

#### Form Group
- Label
- Input field
- Help text
- Error message
- Character count (if applicable)

#### Rating Display
- 5 stars (filled based on rating)
- Numerical rating (e.g., 4.5)
- Review count (e.g., (127))
- Clickable to filter/sort reviews

#### Breadcrumb
- Home icon
- Separator (/)
- Link items
- Current page (not linked)

#### Pagination
- Previous button
- Page numbers (1, 2, 3, ..., 10)
- Next button
- Ellipsis for skipped pages
- Current page highlighted

---

### Organisms

#### Header
- Top announcement bar
- Main header:
  - Logo
  - Search bar
  - Account/Wishlist/Cart icons
- Navigation menu
- Mobile: Hamburger menu

#### Footer
- 4-column layout
- Logo and about text
- Links grouped by category
- Social media icons
- Newsletter signup
- Copyright and legal
- Payment method icons

#### Product Grid
- Responsive grid (4/3/2/1 columns)
- Product cards
- Hover effects
- Quick view functionality
- Load more / Infinite scroll

#### Filter Sidebar
- Category tree
- Filter sections (collapsible)
- Checkboxes and sliders
- Active filter tags
- Apply and Clear buttons

#### Shopping Cart Summary
- Item list
- Quantity controls
- Remove buttons
- Subtotal calculations
- Promo code input
- Delivery threshold
- Proceed to Checkout CTA

#### Review Section
- Overall rating summary
- Rating distribution chart
- Filter dropdown
- Individual review cards
- Load more button
- Write a review CTA

---

### Templates

#### Page Templates

1. **Homepage Template**
   - Header
   - Hero section
   - Featured categories
   - Product carousels
   - Editorial/content sections
   - Footer

2. **Product Listing Template**
   - Header
   - Breadcrumb
   - Page title
   - Filter sidebar
   - Product grid
   - Footer

3. **Product Detail Template**
   - Header
   - Breadcrumb
   - Product main (2 columns)
   - Tabs section
   - Related products
   - Footer

4. **Content Template**
   - Header
   - Hero/Title section
   - Content area (centered, max 800px)
   - Sidebar (optional)
   - Footer

5. **Account Template**
   - Header
   - Sidebar navigation
   - Main content area
   - Footer

---

## Prototyping Guidelines

### Interaction Patterns

#### Hover States
- **Duration**: 200ms
- **Effect**: Slight lift (translateY -2px)
- **Shadow**: Increase depth
- **Color**: Lighten by 10%

#### Click/Tap Feedback
- **Duration**: 150ms
- **Effect**: Slight press (scale 0.98)
- **Then**: Navigate or execute action

#### Page Transitions
- **Duration**: 300ms
- **Effect**: Fade + slight slide up
- **Loading**: Show skeleton screens

#### Modal/Overlay
- **Open**: Fade in background, slide in content from center
- **Close**: Reverse animation
- **Duration**: 300ms
- **Background**: 60% opacity black

#### Drawer/Sidebar
- **Open**: Slide in from left/right
- **Close**: Slide out
- **Duration**: 300ms
- **Backdrop**: Tap to close

#### Toast/Snackbar
- **Appear**: Slide up from bottom
- **Duration**: 3-5 seconds
- **Dismiss**: Slide down or manual close

### Prototyping Connections

#### Homepage
- Logo → Homepage
- Search → Search Results
- Cart icon → Shopping Cart
- Product card → Product Detail
- Category → Product Listing
- Sign In → Login/Account

#### Product Listing
- Filter options → Update product grid
- Sort dropdown → Reorder products
- Product card → Product Detail
- Pagination → Next/previous page

#### Product Detail
- Add to Cart → Cart toast + Update cart badge
- Image → Lightbox
- Tabs → Switch content
- Related products → Other product details
- Reviews → Scroll to reviews section

#### Shopping Cart
- Quantity +/- → Update totals
- Remove → Remove item + Show toast
- Proceed to Checkout → Checkout Step 1

#### Checkout
- Progress through steps → Multi-step flow
- Back → Previous step
- Place Order → Order Confirmation

### Scroll Interactions

- **Sticky Header**: Reduce height when scrolled 100px
- **Fade In**: Elements fade in when scrolling into view
- **Parallax**: Hero images move slower than foreground
- **Infinite Scroll**: Load more products when reaching bottom

### Device-Specific Interactions

**Mobile:**
- Swipe for carousels
- Pull to refresh
- Bottom sheet for filters
- Tap to open/close accordion

**Desktop:**
- Hover for quick view
- Mega menu on hover
- Scroll for carousels
- Click for filters

---

## Handoff Documentation

### Developer Handoff Checklist

#### Design Specs
- [ ] All components have clear specifications
- [ ] Spacing is documented (padding, margins)
- [ ] Colors use named variables from style guide
- [ ] Typography uses text styles
- [ ] Breakpoints are clearly marked
- [ ] Hover/focus states are shown

#### Assets
- [ ] All images exported at 1x, 2x, 3x
- [ ] Icons exported as SVG
- [ ] Favicons at all required sizes
- [ ] OG images for social sharing
- [ ] Optimized for web (compressed)

#### Interactions
- [ ] All clickable elements linked in prototype
- [ ] Animations have duration/easing noted
- [ ] Loading states designed
- [ ] Error states designed
- [ ] Empty states designed
- [ ] Success states designed

#### Responsive
- [ ] Desktop (1920px) designed
- [ ] Tablet (768px) adapted
- [ ] Mobile (375px) adapted
- [ ] Key breakpoint variations shown

#### Accessibility
- [ ] Color contrast checked (WCAG AA)
- [ ] Focus states designed
- [ ] Alt text suggestions provided
- [ ] Heading hierarchy logical
- [ ] Touch targets minimum 44px

### Annotation Guidelines

Use Figma's commenting to note:

1. **Interactions**: "On click, open modal"
2. **Conditional Logic**: "Show if user is logged in"
3. **Dynamic Content**: "Populate from API"
4. **Microcopy**: "Success: Item added to cart!"
5. **Responsive Behavior**: "Stack vertically on mobile"
6. **Animation**: "Fade in, 300ms ease-out"
7. **Accessibility**: "ARIA label: Close menu"

### Component Documentation

For each component in library:

- **Name**: Clear, consistent naming
- **Description**: What it is, when to use it
- **Props/Variants**: Different states and options
- **Usage**: Do's and don'ts
- **Accessibility**: ARIA requirements
- **Responsive**: How it adapts
- **Dependencies**: Required components or styles

---

## Figma Plugins Recommendations

### Design Tools
- **Unsplash**: Stock photos
- **Iconify**: Icon library
- **Lorem Ipsum**: Placeholder text
- **Content Reel**: Realistic content generation

### Prototyping
- **Autoflow**: Connection flow diagrams
- **Stark**: Accessibility checker
- **Contrast**: Color contrast checker

### Handoff
- **Zeplin**: Design handoff
- **Inspect**: Measurement tool
- **Redlines**: Spacing documentation

### Workflow
- **Master**: Component management
- **Find and Replace**: Bulk text updates
- **Batch Styler**: Apply styles to multiple elements

---

**Version**: 1.0  
**Last Updated**: January 7, 2026  
**Maintained By**: Dermastore Design Team
