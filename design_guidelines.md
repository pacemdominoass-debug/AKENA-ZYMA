# E-Commerce Design Guidelines
**Inspired by: Amazon + SHEIN**

## Design Approach
Reference-based design combining Amazon's trusted, information-dense layout with SHEIN's trendy, visual-first aesthetic. Mobile-first implementation optimized for African markets (slower connections, varied devices).

## Typography System
**Primary Font:** Inter (via Google Fonts CDN)
- Headings: 700 weight
- Body: 400 weight  
- Price/CTA: 600 weight

**Hierarchy:**
- Hero/Page Titles: text-3xl md:text-4xl
- Section Headers: text-2xl md:text-3xl
- Product Names: text-lg font-semibold
- Prices: text-xl md:text-2xl font-semibold
- Body Text: text-base
- Captions/Meta: text-sm
- Mobile Price (FCFA): Prominent, always visible

## Layout & Spacing System
**Tailwind Units:** Consistently use 2, 4, 6, 8, 12, 16, 20, 24 for spacing
- Section padding: py-12 md:py-20
- Card padding: p-4 md:p-6
- Element spacing: gap-4, gap-6, gap-8
- Container: max-w-7xl mx-auto px-4

**Grid Systems:**
- Product catalog: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Categories: grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3
- Cart items: Single column (mobile-first)
- Admin tables: Responsive with horizontal scroll on mobile

## Homepage Structure

**Hero Section (60vh on mobile, 70vh on desktop):**
- Large background image showcasing featured products/lifestyle
- Centered overlay with bold headline + primary CTA
- CTA button with backdrop-blur-md bg-white/90
- Minimal text, maximum visual impact

**Category Grid:**
- Horizontal scrolling on mobile, grid on desktop
- Category cards with image + label
- Quick access icons (Heroicons via CDN)

**Featured Products:**
- "Trending Now" and "New Arrivals" sections
- 2-column mobile, 4-column desktop grid
- Product cards showing image, name, price in FCFA, quick "Add to Cart"

**Trust Indicators:**
- "Cash on Delivery Available" badge
- "WhatsApp Ordering" feature highlight
- Simple icons with text

## Product Catalog

**Header:**
- Sticky search bar (mobile: full width, desktop: centered max-w-2xl)
- Filter chips below search (category tags)
- Sort dropdown (Price: Low to High, New Arrivals)

**Filters Panel:**
- Mobile: Bottom sheet/modal
- Desktop: Left sidebar (w-64)
- Price range slider
- Category checkboxes
- Stock availability toggle

**Product Grid:**
- Product cards with 4:5 aspect ratio images
- Hover effect: subtle scale (desktop only)
- Price in large FCFA text
- Stock indicator badge (green: In Stock, red: Low Stock)
- Heart icon for wishlist (future feature)

## Product Detail Page

**Layout:**
- Mobile: Stacked (image gallery → details → add to cart)
- Desktop: Two-column (60% image, 40% details)

**Image Gallery:**
- Main image with thumbnail strip below
- Pinch-to-zoom on mobile
- 4-6 product images

**Product Info Panel:**
- Product name (text-2xl)
- Price in FCFA (text-3xl, bold)
- Stock status with quantity available
- Category tag
- Description (max-w-prose)
- WhatsApp inquiry button (secondary CTA)
- Add to Cart (primary CTA, sticky on mobile)

## Shopping Cart

**Cart Items:**
- Product thumbnail (left, 80px square)
- Name, price, quantity controls (right)
- Remove icon (top-right of each item)
- Quantity: - / input / + buttons

**Cart Summary (Sticky):**
- Subtotal
- "Cash on Delivery" notice
- Proceed to Checkout CTA (full-width, prominent)

## Checkout Flow

**Single Page Form:**
- Clear step indicator: "Your Info → Confirm Order"
- Form fields: Name, Phone, Full Address (textarea)
- Order summary card (sticky on desktop)
- Total in FCFA (large, bold)
- "Complete Order via WhatsApp" primary button
- Explanation text: "You'll be redirected to WhatsApp to confirm"

## Admin Dashboard

**Layout:**
- Side navigation (collapsible on mobile)
- Main content area with data tables
- Action buttons: Add Product (top-right, always visible)

**Product Management Table:**
- Columns: Image (thumbnail), Name, Price (FCFA), Stock, Category, Actions
- Actions: Edit (pencil icon), Delete (trash icon)
- Mobile: Card view instead of table

**Add/Edit Product Form:**
- Image upload placeholder
- Text inputs for name, price, description
- Category dropdown
- Stock number input
- Save/Cancel buttons

## Component Library

**Buttons:**
- Primary: Solid, rounded-lg, py-3 px-6, text-base
- Secondary: Outlined, same sizing
- Icon buttons: p-2, rounded-full

**Cards:**
- Product cards: rounded-lg, border, overflow-hidden
- Shadow: shadow-sm hover:shadow-md transition

**Forms:**
- Inputs: border rounded-lg py-3 px-4, focus:ring-2
- Labels: text-sm font-medium mb-2
- Error states: text-red-600, border-red-300

**Navigation:**
- Mobile: Bottom navigation bar (Home, Categories, Cart, Account)
- Desktop: Top horizontal nav with logo left, search center, cart/account right
- Sticky on scroll

**Icons:**
- Font Awesome via CDN (shopping cart, search, user, WhatsApp, etc.)

## Images Section

**Required Images:**
1. **Hero Background:** Lifestyle shot of products in African context (market scene, happy shoppers, colorful textiles) - Full width, 1920x1080
2. **Category Images:** 6-8 category thumbnails (clothing, electronics, accessories, beauty, home, shoes) - 400x400 each
3. **Featured Products:** 8-12 product photos with clean white backgrounds - 800x1000 each
4. **Product Details:** Multiple angles per product (front, back, detail shots, lifestyle) - 1000x1250 each
5. **Trust Badges:** Cash on delivery icon, WhatsApp logo, secure shopping - SVG preferred

**Image Treatment:**
- Hero: Slight overlay (bg-black/30) for text readability
- Products: Clean, consistent lighting, white/neutral backgrounds
- Categories: Vibrant, representative of product types

## Performance Considerations
- Lazy load images below fold
- Compress images (WebP format)
- Minimal JavaScript for core shopping functions
- Progressive enhancement for filters/search

## Mobile-First Priorities
- Touch-friendly targets (min 44px)
- Thumb-zone optimization for primary actions
- WhatsApp integration as primary contact method
- Simplified checkout (fewer form fields)
- Fast load times (<3s on 3G)