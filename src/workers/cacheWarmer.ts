import * as dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
import { preloadPopularProducts } from "@/utils/cache/cacheWarming";

const REDIS_URL = process.env.REDIS_URL;
const WARMING_INTERVAL_MINUTES = parseInt(
  process.env.CACHE_WARMING_INTERVAL_MINUTES || "30",
  10
);
const WARMING_INTERVAL_MS = WARMING_INTERVAL_MINUTES * 60 * 1000;

let redisClient: Redis | null = null;

async function connectRedis() {
  if (!REDIS_URL) {
    console.error("CACHE WARMER: REDIS_URL is not set. Worker cannot start.");
    process.exit(1);
  }
  try {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
    });
    await redisClient.ping();
    console.log("CACHE WARMER: Connected to Redis.");

    redisClient.on("error", (error) => {
      console.error("CACHE WARMER: Redis connection error:", error);
    });
  } catch (error) {
    console.error("CACHE WARMER: Failed to connect to Redis:", error);
    process.exit(1);
  }
}

async function runCacheWarming() {
  if (!redisClient || redisClient.status !== "ready") {
    console.log("CACHE WARMER: Redis not ready, skipping warming cycle.");
    return;
  }

  console.log(`CACHE WARMER: Starting cache warming cycle...`);
  try {
    await preloadPopularProducts(redisClient);
    console.log(`CACHE WARMER: Cache warming cycle completed.`);
  } catch (error) {
    console.error("CACHE WARMER: Error during cache warming cycle:", error);
  }
}

async function startWorker() {
  await connectRedis();

  console.log(
    `CACHE WARMER: Worker started. Warming cache every ${WARMING_INTERVAL_MINUTES} minutes.`
  );

  await runCacheWarming();

  setInterval(runCacheWarming, WARMING_INTERVAL_MS);
}

process.on("SIGTERM", () => {
  console.log("CACHE WARMER: Received SIGTERM. Shutting down...");
  if (redisClient) {
    redisClient.quit();
  }
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("CACHE WARMER: Received SIGINT. Shutting down...");
  if (redisClient) {
    redisClient.quit();
  }
  process.exit(0);
});

startWorker().catch((err) => {
  console.error("CACHE WARMER: Worker failed to start:", err);
  process.exit(1);
});
