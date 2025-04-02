/**
 * Redis Client Implementation for Sensory Memory
 * 
 * This module implements the Redis client with methods for handling
 * sensory memory operations including chunk storage, processing queues,
 * and batch management.
 */

import { Redis } from 'ioredis';
import { StandardizedChunk, ChunkBatch } from '../../shared/types/standardized-chunk';
import { createRedisClient, SensoryMemoryKeys, SensoryMemoryTTL, RedisConfig } from './config';

export class SensoryMemoryClient {
  private client: Redis;

  constructor(config?: RedisConfig) {
    this.client = createRedisClient(config);
  }

  /**
   * Store a raw chunk in sensory memory
   */
  async storeRawChunk(chunk: StandardizedChunk): Promise<void> {
    const key = SensoryMemoryKeys.rawChunk(chunk.id);
    await this.client.setex(
      key,
      SensoryMemoryTTL.rawChunk,
      JSON.stringify(chunk)
    );
  }

  /**
   * Retrieve a raw chunk from sensory memory
   */
  async getRawChunk(chunkId: string): Promise<StandardizedChunk | null> {
    const key = SensoryMemoryKeys.rawChunk(chunkId);
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Add a chunk to the processing queue
   */
  async enqueueChunk(chunkId: string): Promise<void> {
    await this.client.lpush(SensoryMemoryKeys.processingQueue, chunkId);
  }

  /**
   * Get next chunk from processing queue
   */
  async dequeueChunk(): Promise<string | null> {
    return this.client.rpop(SensoryMemoryKeys.processingQueue);
  }

  /**
   * Store a batch status
   */
  async storeBatchStatus(batchId: string, status: string): Promise<void> {
    const key = SensoryMemoryKeys.batchStatus(batchId);
    await this.client.setex(
      key,
      SensoryMemoryTTL.batchStatus,
      status
    );
  }

  /**
   * Get batch status
   */
  async getBatchStatus(batchId: string): Promise<string | null> {
    const key = SensoryMemoryKeys.batchStatus(batchId);
    return this.client.get(key);
  }

  /**
   * Store batch chunks
   */
  async storeBatchChunks(batch: ChunkBatch): Promise<void> {
    const key = SensoryMemoryKeys.batchChunks(batch.batchId);
    await this.client.setex(
      key,
      SensoryMemoryTTL.batchStatus,
      JSON.stringify(batch.chunks)
    );
  }

  /**
   * Get batch chunks
   */
  async getBatchChunks(batchId: string): Promise<StandardizedChunk[] | null> {
    const key = SensoryMemoryKeys.batchChunks(batchId);
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Check rate limit for a connector
   */
  async checkRateLimit(connectorId: string, limit: number): Promise<boolean> {
    const key = SensoryMemoryKeys.rateLimit(connectorId);
    const current = await this.client.incr(key);
    
    if (current === 1) {
      await this.client.expire(key, SensoryMemoryTTL.rateLimit);
    }
    
    return current <= limit;
  }

  /**
   * Update health check status
   */
  async updateHealthStatus(status: 'healthy' | 'degraded' | 'down'): Promise<void> {
    const key = SensoryMemoryKeys.healthCheck;
    await this.client.setex(
      key,
      SensoryMemoryTTL.healthCheck,
      status
    );
  }

  /**
   * Get health check status
   */
  async getHealthStatus(): Promise<string | null> {
    const key = SensoryMemoryKeys.healthCheck;
    return this.client.get(key);
  }

  /**
   * Close the Redis connection
   */
  async close(): Promise<void> {
    await this.client.quit();
  }

  async cleanup(): Promise<void> {
    await this.client.flushall();
    await this.close();
  }
} 