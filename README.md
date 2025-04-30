<div align="center">
  <img src="https://raw.githubusercontent.com/b-amir/snack-shop/main/src/docs/screenshots/logo.png" alt="SnackShop Logo" style="max-width: 100%; height: auto;">
</div>
<br/>

# SnackShop - E-commerce Demo

This project demonstrates an e-commerce application for an online store with Next.js and Redis caching. It simulates a large-scale marketplace (20K+ products, 5M+ users) where page load speed and server performance are critical.

👈 [برای مطالعه نسخه فارسی این راهنما، اینجا کلیک کنید.](./src/docs/README-FA.md)

---

<div align="center">
  <h2>
    🚀 <a href="https://88p29d-3000.csb.app" target="_blank">Live Demo!</a>
     ✨ <a href="https://codesandbox.io/p/github/b-amir/snack-shop/main?import=true" target="_blank">CodeSandbox</a> 
  </h2>
</div>

<div style="display: flex; justify-content: center;">
  <img src="https://raw.githubusercontent.com/b-amir/snack-shop/main/src/docs/screenshots/home-en.png" alt="Home Page (English)" style="max-width: 100%; height: auto;">
</div>

## Core Architecture

- **Framework**: Next.js 15 App Router
- **Caching**: Redis-based caching strategy for product data & API responses
- **Rendering**: Hybrid rendering approach optimized for each page type
- **i18n**: Supports English & Farsi using `next-intl`
- **State Management**: Cart data stored in Redis with client-side Zustand
- **Testing**: Unit and E2E tests with Jest and Cypress

## Deliberate Constraints

This project intentionally limits its scope to focus on core functionality. Key constraints include:

- **Minimal libraries**: Reduces complexity and bundle size by using only essential packages.
- **No UI libraries**: Uses only CSS modules for styling.
- **No authentication**: Relies on session ID cookies for cart tracking instead of full authentication.
- **No analytics**: Simulates high-traffic products by caching the 8 newest products.
- **No database**: Uses a JSON file for product data storage to simplify implementation.

## Rendering Patterns

Each page type uses a specific Next.js rendering strategy with Redis caching to optimize performance.

### Product Listing Pages (PLP - `/`)

- **Next.js Strategy**: Dynamic Rendering with Incremental Static Regeneration (ISR).
  - Uses React Server Components for server-side data fetching.
  - Configures page regeneration every 60 seconds with `revalidate = 60`.
- **Reasoning**: Balances data freshness with performance. Shows updated product listings while reducing API calls.
- **Redis Cache Strategy**:
  - Caches product list API responses with a 5-minute TTL.
  - Provides faster data access before Next.js ISR regeneration triggers.

```tsx
// src/app/[locale]/page.tsx - Configures Next.js ISR
export const revalidate = 60; // Regenerate page max once per 60s

// src/constants/index.ts - Defines Redis TTL for product list API data
export const PRODUCT_LIST_CACHE_TTL = 5 * 60; // 5 minutes
```

### Product Details Pages (PDP - `/products/[productId]`)

- **Next.js Strategy**: Static Site Generation (SSG) at build time for the newest 8 products, with Incremental Static Regeneration (ISR) for all product pages.
  - Pre-renders the 8 newest products via `generateStaticParams`.
  - Sets hourly regeneration with `revalidate = 3600`.
  - Enables on-demand page generation with `dynamicParams = true`.
- **Reasoning**: Optimizes for high-traffic products by serving them from the edge/CDN. ISR keeps less popular pages updated without requiring full rebuilds.
- **Redis Cache Strategy**:
  - Caches product detail API responses with a 30-minute TTL.
  - Provides faster access than waiting for the 1-hour ISR interval.

```tsx
// src/app/[locale]/products/[productId]/page.tsx
export const revalidate = 3600; // Regenerate page max once per hour (ISR)
export const dynamicParams = true; // Allow generating pages not built initially

// src/constants/index.ts - Defines Redis TTL for product detail API data
export const PRODUCT_DETAIL_CACHE_TTL = 30 * 60; // 30 minutes
```

### Cart & Checkout

- **Implementation**: Client-side with Zustand for state management
- **Reasoning**: Provides immediate user feedback while minimizing server load
- **Persistence**: Cart data synced to Redis for consistency

```tsx
// src/store/store.ts
import { create } from "zustand";
export const useCartStore = create<CartState>()((set, get) => ({
  // Cart operations that sync with the server
  fetchCart: async () => {
    // Fetch from /api/cart
  },
  addToCart: async (product, quantity = 1) => {
    // Optimistic updates and server sync
  },
  // ...
}));
```

## Performance Optimizations

### Multi-layered Caching Architecture

This project implements a multi-layered caching strategy:

1. **Next.js ISR Layer**: Caches rendered pages with timed invalidation
2. **Redis Cache Layer**: Caches API responses before they reach Next.js
3. **CDN/Edge Layer**: Caches ISR pages at the edge when deployed to platforms like Vercel

```mermaid
sequenceDiagram
    participant User
    participant Next
    participant Redis
    participant Data

    User->>Next: Request product page
    alt Page in Next.js cache
        Next-->>User: Return cached page
    else Page not in cache
        Next->>Redis: Check for API data
        alt Redis cache hit
            Redis-->>Next: Return cached data
            Next-->>User: Render and return page
        else Redis cache miss
            Redis-->>Next: Cache miss
            Next->>Data: Fetch from source
            Data-->>Next: Return data
            Next->>Redis: Store with TTL
            Next-->>User: Render and return page
        end
    end
```

### Redis Caching Strategy

The application uses Redis for high-performance caching with appropriate TTLs:

- **Product listings**: 5 minutes (`PRODUCT_LIST_CACHE_TTL`)
- **Product details**: 30 minutes (`PRODUCT_DETAIL_CACHE_TTL`)
- **Related products**: 15 minutes (`RELATED_PRODUCTS_CACHE_TTL`)

Each cache entry uses a structured key pattern:

```
products:{page}:{pageSize}:{sort}    // For product listings
product:{productId}                  // For product details
related:{productId}:{locale}:{limit} // For related products
```

```typescript
// src/services/productService.ts
export async function fetchProducts({
  page = 1,
  limit,
  pageSize,
  sort = DEFAULT_SORT_ORDER,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const cacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}${page}:${effectivePageSize}:${sort}`;
  const cachedData = await checkCache<ProductsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  // Fetch and cache if not found...
}
```

### Cache Warming Process

A standalone worker (`src/workers/cacheWarmer.ts`) preloads key data into Redis every 10 minutes:

```mermaid
sequenceDiagram
    participant Worker
    participant Redis
    participant Data

    Worker->>Data: Fetch newest products
    Data-->>Worker: Return product data
    Worker->>Redis: Cache product listing (5min TTL)
    loop For each product
        Worker->>Redis: Cache product details (30min TTL)
    end
```

This worker proactively caches:

1. The default first page of products (most common entry point)
2. Details for each product on that first page

```typescript
// src/utils/cache/cacheWarming.ts
export async function warmCache(): Promise<void> {
  // Fetch default product list
  const productListData = await fetchProducts({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sort: DEFAULT_SORT_ORDER,
  });

  // Cache the list
  const listCacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}1:${DEFAULT_PAGE_SIZE}:${DEFAULT_SORT_ORDER}`;
  await setCache(listCacheKey, productListData, PRODUCT_LIST_CACHE_TTL);

  // Cache details for each product
  const productsToWarm = productListData.products;
  for (const product of productsToWarm) {
    const detailCacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${product.id}`;
    await setCache(detailCacheKey, { product }, PRODUCT_DETAIL_CACHE_TTL);
  }
}
```

### Cache Invalidation

The application provides a secure `/api/revalidate` endpoint that performs dual invalidation:

```mermaid
sequenceDiagram
    participant CMS
    participant API
    participant Redis
    participant Next.js

    CMS->>API: POST /api/revalidate
    API->>Redis: Clear product cache
    API->>Redis: Clear listings cache
    API->>Next.js: Revalidate paths
    API-->>CMS: Confirmation
```

This invalidation process:

1. Invalidates Redis cache for specific product and listings
2. Triggers Next.js path revalidation to regenerate affected pages
3. Secures the process with a token-based authentication

```typescript
// src/app/api/revalidate/route.ts
export async function POST(request: NextRequest) {
  // Validate request & get data
  const { productId, localesToRevalidate } = validationResult;

  // Perform dual invalidation
  await invalidateProductCache(productId);
  await invalidateProductListingCache();
  revalidateNextPaths(productId, localesToRevalidate);

  // Return confirmation
  return NextResponse.json({ revalidated: true /* ... */ });
}
```

### Fallback Mechanism

The system includes a fallback in-memory cache that activates if Redis becomes unavailable:

```typescript
// src/utils/cache/client/redis.ts
async function getClient(): Promise<CacheClient | null> {
  const { client, error } = await clientState;
  if (error && !client.isFallback) {
    console.error(`[Cache] Using fallback due to Redis initialization error`);
  }
  return client;
}
```

### Image Optimization

- Uses Next.js Image component for format selection and responsive sizing
- Implements lazy loading for below-the-fold images
- Provides optional Cloudinary CDN integration via environment flag

### Core Web Vitals Focus

- Optimizes LCP through prioritized loading of critical content
- Reduces CLS by maintaining proper image aspect ratios
- Improves FID by minimizing main thread work with React Server Components

### Code Optimizations

- Uses shared components for consistent UI and reduced bundle size

## Running the Project

**1. Main Application:**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# --- OR ---

# Build for production
npm run build

# Run production server
npm start
```

**2. Cache Warming Worker (Optional):**

```bash
# Run worker in development mode
npm run cache:warm:dev

# --- OR ---

# Run worker in production mode
npm run cache:warm:prod
```

## Testing

- **Unit Tests**: Jest for testing utility functions and components
- **E2E Tests**: Cypress for critical user flows (browsing products, cart management)
- **Manual Testing**: Responsive design verified across devices

```bash
# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e
```

## Configuration

Copy `.env.example` to `.env.local` in the project root and set the required variables:

```env
# Required for Redis connection
REDIS_URL=...

# Optional: Use Cloudinary CDN for images
# If false, uses next/image optimization
NEXT_PUBLIC_USE_CLOUDINARY_CDN=true

...

```

## Project Structure

```
├── src/
│   ├── app/            # Next.js App Router pages, layouts, and API routes
│   ├── components/     # Reusable UI components
│   ├── data/           # products.json data file
│   ├── features/       # Feature-based folder structure
│   ├── i18n/           # localization configs and dictionaries
│   ├── services/       # API and data services
│   ├── store/          # Zustand store for cart management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── workers/        # Background workers for cache warming
├── public/             # Static assets
├── cypress/            # E2E tests
```

## Screenshots

| Home (EN)                                                                                                         | Home (FA)                                                                                                       | PDP                                                                                                           | Redis Logs                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ![Home Page (English)](https://raw.githubusercontent.com/b-amir/snack-shop/main/src/docs/screenshots/home-en.png) | ![Home Page (Farsi)](https://raw.githubusercontent.com/b-amir/snack-shop/main/src/docs/screenshots/home-fa.png) | ![Product Detail Page](https://raw.githubusercontent.com/b-amir/snack-shop/main/src/docs/screenshots/pdp.png) | ![Redis Logs](https://raw.githubusercontent.com/b-amir/snack-shop/main/src/docs/screenshots/redis-logs.png) |
