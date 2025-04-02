/**
 * Tests for Redis Client Implementation
 */

import { SensoryMemoryClient } from '../../../src/database/redis/client';
import { StandardizedChunk, ContentType } from '../../../src/shared/types/standardized-chunk';

// Mock Redis client
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    setex: jest.fn(),
    get: jest.fn(),
    lpush: jest.fn(),
    rpop: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    quit: jest.fn(),
  }));
});

describe('SensoryMemoryClient', () => {
  let client: SensoryMemoryClient;
  let mockRedis: any;

  beforeEach(() => {
    client = new SensoryMemoryClient();
    mockRedis = (client as any).client;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storeRawChunk', () => {
    it('should store a raw chunk with correct TTL', async () => {
      const chunk: StandardizedChunk = {
        id: 'test-chunk-1',
        connectorId: 'test-connector',
        content: 'Test content',
        contentType: ContentType.TEXT,
        source: {
          type: 'test',
          id: 'test-source',
        },
        processedAt: new Date().toISOString(),
      };

      await client.storeRawChunk(chunk);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'sensory:raw:test-chunk-1',
        3600, // TTL from SensoryMemoryTTL
        JSON.stringify(chunk)
      );
    });
  });

  describe('getRawChunk', () => {
    it('should return null when chunk does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await client.getRawChunk('non-existent');

      expect(result).toBeNull();
    });

    it('should return parsed chunk when it exists', async () => {
      const chunk = {
        id: 'test-chunk-1',
        content: 'Test content',
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(chunk));

      const result = await client.getRawChunk('test-chunk-1');

      expect(result).toEqual(chunk);
    });
  });

  describe('enqueueChunk', () => {
    it('should add chunk to processing queue', async () => {
      await client.enqueueChunk('test-chunk-1');

      expect(mockRedis.lpush).toHaveBeenCalledWith(
        'sensory:queue:processing',
        'test-chunk-1'
      );
    });
  });

  describe('dequeueChunk', () => {
    it('should return null when queue is empty', async () => {
      mockRedis.rpop.mockResolvedValue(null);

      const result = await client.dequeueChunk();

      expect(result).toBeNull();
    });

    it('should return chunk ID when queue has items', async () => {
      mockRedis.rpop.mockResolvedValue('test-chunk-1');

      const result = await client.dequeueChunk();

      expect(result).toBe('test-chunk-1');
    });
  });

  describe('checkRateLimit', () => {
    it('should return true when under limit', async () => {
      mockRedis.incr.mockResolvedValue(1);

      const result = await client.checkRateLimit('test-connector', 10);

      expect(result).toBe(true);
      expect(mockRedis.expire).toHaveBeenCalledWith(
        'sensory:rate:test-connector',
        60 // TTL from SensoryMemoryTTL
      );
    });

    it('should return false when over limit', async () => {
      mockRedis.incr.mockResolvedValue(11);

      const result = await client.checkRateLimit('test-connector', 10);

      expect(result).toBe(false);
    });
  });

  describe('close', () => {
    it('should close Redis connection', async () => {
      await client.close();

      expect(mockRedis.quit).toHaveBeenCalled();
    });
  });
}); 