// Product List Defaults
export const AVAILABLE_PAGE_SIZES = [8, 16];
export const DEFAULT_PAGE_SIZE = 8;
export const DEFAULT_SORT_ORDER = "date_desc";
export const RELATED_PRODUCTS_DEFAULT_LIMIT = 3;

// UI Defaults
export const DEFAULT_TOAST_DURATION = 3000; // 3 seconds
export const TOAST_ANIMATION_DURATION = 300; // 300ms

// Cache Settings
export const PRODUCT_LIST_CACHE_TTL = 5 * 60; // 5 minutes (in seconds)
export const PRODUCT_DETAIL_CACHE_TTL = 30 * 60; // 30 minutes (in seconds)
export const RELATED_PRODUCTS_CACHE_TTL = 15 * 60; // 15 minutes (in seconds)
export const CACHE_WARMING_INTERVAL_MINUTES = 10; // 10 minutes
export const FALLBACK_CACHE_CLEANUP_INTERVAL_MINUTES = 10; // 10 minutes
export const REDIS_CONNECT_TIMEOUT_MS = 2000; // 2 seconds
export const REDIS_MAX_RETRIES = 3;
export const CACHE_KEY_PRODUCT_DETAIL_PREFIX = "product:";
export const CACHE_KEY_PRODUCT_LIST_PREFIX = "products:";
export const CACHE_KEY_RELATED_PRODUCTS_PREFIX = "related:";
export const CACHE_KEY_CART_PREFIX = "cart:";

// Session/Auth Settings
export const CART_SESSION_COOKIE_NAME = "cartSessionId";
export const CART_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (in seconds)

// Misc
export const REVALIDATION_EVENT_MANUAL = "manual_trigger";
