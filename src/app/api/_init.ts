import { scheduleCacheWarming } from "@/utils/cache";

if (process.env.NODE_ENV === "production") {
  scheduleCacheWarming(30);
}

export const config = {
  runtime: "nodejs",
};
