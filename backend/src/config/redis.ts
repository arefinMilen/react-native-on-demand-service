import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT, 10),
  password: env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  enableOfflineQueue: false, // Prevents ioredis from hanging/rejecting when local Redis is offline
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis cache service');
});

redis.on('error', (err) => {
  // Silent fallback when Redis service is not active locally
  console.warn('⚠️ Redis offline (In-memory fallback active):', err.message);
});
