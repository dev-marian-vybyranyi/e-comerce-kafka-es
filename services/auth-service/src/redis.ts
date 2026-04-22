import Redis from "ioredis";

export const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

redis.on("connect", () => console.log("[Redis] Connected"));
redis.on("error", (err) => console.error("[Redis] Error:", err));

const REFRESH_TTL = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || "604800");

export async function saveRefreshToken(
  token: string,
  userId: string,
): Promise<void> {
  await redis.setex(`refresh:${token}`, REFRESH_TTL, userId);
}

export async function getRefreshToken(token: string): Promise<string | null> {
  return redis.get(`refresh:${token}`);
}

export async function deleteRefreshToken(token: string): Promise<void> {
  await redis.del(`refresh:${token}`);
}

export async function deleteAllUserTokens(userId: string): Promise<void> {
  const keys = await redis.keys(`refresh:*`);
  for (const key of keys) {
    const val = await redis.get(key);
    if (val === userId) await redis.del(key);
  }
}
