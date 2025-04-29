export {
  getCache,
  setCache,
  deleteCache,
  isUsingFallback,
  getCacheInitializationError,
  disconnectCache,
} from "./client/redis";

export {
  invalidateProductCache,
  invalidateProductListingCache,
} from "./cacheInvalidation";

export { warmCache } from "./cacheWarming";

export type { CacheClient } from "./types";
