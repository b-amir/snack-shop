export type CacheClient = {
  readonly isFallback: boolean;

  get(key: string): Promise<string | null>;

  set(
    key: string,
    value: string,
    mode?: "EX",
    ttlSeconds?: number
  ): Promise<"OK" | null>;

  del(keyOrKeys: string | string[]): Promise<number>;

  disconnect(): Promise<void>;
};
