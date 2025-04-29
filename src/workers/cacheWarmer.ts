import * as dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
import { warmCache } from "@/utils/cache/cacheWarming";
import {
  CACHE_WARMING_INTERVAL_MINUTES,
  REDIS_MAX_RETRIES,
  REDIS_CONNECT_TIMEOUT_MS,
} from "@/constants";

const REDIS_URL = process.env.REDIS_URL;
const warmingIntervalMinutes = parseInt(
  process.env.CACHE_WARMING_INTERVAL_MINUTES ||
    String(CACHE_WARMING_INTERVAL_MINUTES),
  10
);
const WARMING_INTERVAL_MS = warmingIntervalMinutes * 60 * 1000;

let redisClient: Redis | null = null;

async function connectRedis() {
  if (!REDIS_URL) {
    console.error("[Cache Warmer] REDIS_URL is not set. Worker cannot start.");
    process.exit(1);
  }
  try {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: REDIS_MAX_RETRIES,
      connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
    });
    await redisClient.ping();
    console.log("[Cache Warmer] Connected to Redis.");

    redisClient.on("error", (error) => {
      console.error("[Cache Warmer] Redis connection error:", error);
    });
  } catch (error) {
    console.error("[Cache Warmer] Failed to connect to Redis:", error);
    process.exit(1);
  }
}

async function runCacheWarmingCycle() {
  console.log(`[Cache Warmer] Starting cache warming cycle...`);
  try {
    await warmCache();
    console.log(`[Cache Warmer] Cache warming cycle completed.`);
  } catch (error) {
    console.error("[Cache Warmer] Error during cache warming cycle:", error);
  }
}

async function startWorker() {
  await connectRedis();

  console.log(
    `[Cache Warmer] Worker started. Warming cache every ${warmingIntervalMinutes} minutes.`
  );

  await runCacheWarmingCycle();

  setInterval(runCacheWarmingCycle, WARMING_INTERVAL_MS);
}

process.on("SIGTERM", () => {
  console.log("[Cache Warmer] Received SIGTERM. Shutting down...");
  if (redisClient) {
    redisClient.quit();
  }
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[Cache Warmer] Received SIGINT. Shutting down...");
  if (redisClient) {
    redisClient.quit();
  }
  process.exit(0);
});

startWorker().catch((err) => {
  console.error("[Cache Warmer] Worker failed to start:", err);
  process.exit(1);
});
