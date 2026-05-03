import Redis from 'ioredis';
import { LRUCache } from 'lru-cache';

// Fallback in-memory cache for local development without Redis
const memoryCache = new LRUCache({
  max: 10000,
  ttl: 1000 * 60 * 60 * 24 // 24 hours
});

// For rate limiting fallback
const rateLimitCache = new LRUCache({
  max: 10000,
  ttl: 1000 * 60 // 1 minute
});

const redisUrl = process.env.REDIS_URL || '';
export const redis = redisUrl ? new Redis(redisUrl) : null;

if (!redis) {
  console.warn("⚠️ REDIS_URL not found. Using in-memory fallback cache for local testing.");
}

export async function getCache(key: string): Promise<any> {
  if (redis) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  return memoryCache.get(key);
}

export async function setCache(key: string, value: any, ttlSeconds: number = 86400): Promise<void> {
  if (redis) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } else {
    memoryCache.set(key, value, { ttl: ttlSeconds * 1000 });
  }
}

export async function incrementRateLimit(ip: string): Promise<number> {
  const key = `ratelimit:${ip}`;
  if (redis) {
    const multi = redis.multi();
    multi.incr(key);
    multi.expire(key, 60); // 1 minute window
    const results = await multi.exec();
    return results ? (results[0][1] as number) : 1;
  } else {
    const current = (rateLimitCache.get(key) as number) || 0;
    const next = current + 1;
    rateLimitCache.set(key, next);
    return next;
  }
}
