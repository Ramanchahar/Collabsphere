/**
 * Redis Configuration for Sensory Memory
 * 
 * This module handles Redis connection configuration for the sensory memory layer.
 * Sensory memory acts as a buffer for initial data intake and preprocessing.
 */

import { Redis } from 'ioredis';
import { z } from 'zod';

// Redis configuration schema
export const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(6379),
  password: z.string().optional(),
  db: z.number().default(0),
  keyPrefix: z.string().default('sensory:'),
  maxRetriesPerRequest: z.number().default(3),
  retryStrategy: z.function()
    .args(z.number())
    .returns(z.number().optional())
    .optional(),
});

export type RedisConfig = z.infer<typeof RedisConfigSchema>;

// Default configuration
export const defaultRedisConfig: RedisConfig = {
  host: 'localhost',
  port: 6379,
  db: 0,
  keyPrefix: 'sensory:',
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

/**
 * Creates a Redis client instance with the provided configuration
 */
export function createRedisClient(config: RedisConfig = defaultRedisConfig): Redis {
  const validatedConfig = RedisConfigSchema.parse(config);
  return new Redis(validatedConfig);
}

/**
 * Sensory memory key patterns
 */
export const SensoryMemoryKeys = {
  // Raw chunk storage
  rawChunk: (chunkId: string) => `raw:${chunkId}`,
  
  // Processing queue
  processingQueue: 'queue:processing',
  
  // Temporary storage
  tempChunk: (chunkId: string) => `temp:${chunkId}`,
  
  // Batch tracking
  batchStatus: (batchId: string) => `batch:${batchId}:status`,
  batchChunks: (batchId: string) => `batch:${batchId}:chunks`,
  
  // Rate limiting
  rateLimit: (connectorId: string) => `rate:${connectorId}`,
  
  // Health check
  healthCheck: 'health:status',
} as const;

/**
 * Sensory memory TTLs (in seconds)
 */
export const SensoryMemoryTTL = {
  rawChunk: 3600,        // 1 hour
  tempChunk: 300,        // 5 minutes
  batchStatus: 7200,     // 2 hours
  rateLimit: 60,         // 1 minute
  healthCheck: 30,       // 30 seconds
} as const; 