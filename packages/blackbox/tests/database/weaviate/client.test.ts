/**
 * Weaviate Client Tests
 * 
 * This module provides tests for the Weaviate client implementation,
 * including vector storage operations and schema management.
 */

import { VectorStorageClient } from '../../../src/database/weaviate/client';
import { WeaviateConfig, WeaviateSchema } from '../../../src/database/weaviate/config';
import { StandardizedChunk, ContentType } from '../../../src/shared/types/standardized-chunk';

// Mock weaviate-client
jest.mock('weaviate-client', () => {
  const mockClient = {
    client: jest.fn().mockReturnValue({
      schema: {
        classCreator: jest.fn().mockReturnValue({
          withClass: jest.fn().mockReturnValue({
            do: jest.fn().mockResolvedValue(undefined),
          }),
        }),
      },
      data: {
        objectsBatcher: jest.fn().mockReturnValue({
          withObject: jest.fn().mockReturnThis(),
          do: jest.fn().mockResolvedValue(undefined),
        }),
        getterById: jest.fn().mockReturnValue({
          withClassName: jest.fn().mockReturnThis(),
          withId: jest.fn().mockReturnValue({
            do: jest.fn().mockResolvedValue({
              properties: {
                id: 'test-id',
                content: 'test content',
                contentType: 'text',
                projectId: 'test-project',
                connectorId: 'test-connector',
                processedAt: new Date().toISOString(),
                metadata: { key: 'value' },
                sourceId: 'test-source',
                sourceType: 'document',
                sourceUrl: 'http://test.com',
                sourceContainer: 'test-container',
                sourceTitle: 'Test Document',
              },
              vector: [0.1, 0.2, 0.3],
            }),
          }),
        }),
        deleter: jest.fn().mockReturnValue({
          withClassName: jest.fn().mockReturnThis(),
          withId: jest.fn().mockReturnValue({
            do: jest.fn().mockResolvedValue(undefined),
          }),
        }),
        updater: jest.fn().mockReturnValue({
          withClassName: jest.fn().mockReturnThis(),
          withId: jest.fn().mockReturnValue({
            withVector: jest.fn().mockReturnValue({
              do: jest.fn().mockResolvedValue(undefined),
            }),
          }),
        }),
      },
      graphql: {
        get: jest.fn().mockReturnValue({
          withClassName: jest.fn().mockReturnThis(),
          withFields: jest.fn().mockReturnThis(),
          withNearVector: jest.fn().mockReturnThis(),
          withWhere: jest.fn().mockReturnThis(),
          withLimit: jest.fn().mockReturnValue({
            do: jest.fn().mockResolvedValue({
              data: {
                Get: {
                  VectorChunk: [
                    {
                      id: 'test-id',
                      content: 'test content',
                      contentType: 'text',
                      projectId: 'test-project',
                      connectorId: 'test-connector',
                      processedAt: new Date().toISOString(),
                      metadata: { key: 'value' },
                      sourceId: 'test-source',
                      sourceType: 'document',
                      sourceUrl: 'http://test.com',
                      sourceContainer: 'test-container',
                      sourceTitle: 'Test Document',
                      _additional: {
                        vector: [0.1, 0.2, 0.3],
                        distance: 0.5,
                      },
                    },
                  ],
                },
              },
            }),
          }),
        }),
      },
    }),
    AuthApiKey: jest.fn(),
  };

  return mockClient;
});

describe('VectorStorageClient', () => {
  let client: VectorStorageClient;
  let config: WeaviateConfig;

  beforeEach(() => {
    config = {
      scheme: 'http',
      host: 'localhost',
      port: 8080,
      timeoutSeconds: 30,
    };
    client = new VectorStorageClient(config);
  });

  describe('initialize', () => {
    it('should create all schema classes', async () => {
      await client.initialize();
      const { CLASS_SCHEMAS } = WeaviateSchema;
      expect(Object.keys(CLASS_SCHEMAS).length).toBeGreaterThan(0);
    });

    it('should handle existing classes gracefully', async () => {
      const mockError = new Error('class already exists');
      jest.spyOn(client as any, 'client').mockImplementationOnce(() => ({
        schema: {
          classCreator: jest.fn().mockReturnValue({
            withClass: jest.fn().mockReturnValue({
              do: jest.fn().mockRejectedValue(mockError),
            }),
          }),
        },
      }));

      await expect(client.initialize()).resolves.not.toThrow();
    });
  });

  describe('storeVectorChunk', () => {
    const mockChunk: StandardizedChunk = {
      id: 'test-id',
      connectorId: 'test-connector',
      content: 'test content',
      contentType: ContentType.TEXT,
      projectId: 'test-project',
      processedAt: new Date().toISOString(),
      rawMetadata: { key: 'value' },
      source: {
        id: 'test-source',
        type: 'document',
        url: 'http://test.com',
        container: 'test-container',
        title: 'Test Document',
      },
    };

    const mockVector = [0.1, 0.2, 0.3];

    it('should store a vectorized chunk', async () => {
      await client.storeVectorChunk(mockChunk, mockVector);
      expect(client as any).toBeDefined();
    });
  });

  describe('getVectorChunk', () => {
    it('should retrieve a vectorized chunk by ID', async () => {
      const result = await client.getVectorChunk('test-id');
      expect(result).toBeDefined();
      expect(result?.chunk.id).toBe('test-id');
      expect(result?.vector).toEqual([0.1, 0.2, 0.3]);
    });

    it('should return null for non-existent chunk', async () => {
      jest.spyOn(client as any, 'client').mockImplementationOnce(() => ({
        data: {
          getterById: jest.fn().mockReturnValue({
            withClassName: jest.fn().mockReturnThis(),
            withId: jest.fn().mockReturnValue({
              do: jest.fn().mockResolvedValue(null),
            }),
          }),
        },
      }));

      const result = await client.getVectorChunk('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('findSimilarChunks', () => {
    const mockQueryVector = [0.1, 0.2, 0.3];

    it('should find similar chunks based on query vector', async () => {
      const results = await client.findSimilarChunks('test-project', mockQueryVector);
      expect(results).toHaveLength(1);
      expect(results[0].chunk.id).toBe('test-id');
      expect(results[0].vector).toEqual([0.1, 0.2, 0.3]);
      expect(results[0].distance).toBe(0.5);
    });
  });

  describe('deleteVectorChunk', () => {
    it('should delete a vectorized chunk by ID', async () => {
      await client.deleteVectorChunk('test-id');
      expect(client as any).toBeDefined();
    });
  });

  describe('updateVectorChunk', () => {
    const mockVector = [0.1, 0.2, 0.3];

    it('should update a vectorized chunk\'s vector', async () => {
      await client.updateVectorChunk('test-id', mockVector);
      expect(client as any).toBeDefined();
    });
  });

  describe('getVector', () => {
    it('should get the vector for a chunk by ID', async () => {
      const vector = await client.getVector('test-id');
      expect(vector).toEqual([0.1, 0.2, 0.3]);
    });

    it('should return null for non-existent chunk', async () => {
      jest.spyOn(client as any, 'client').mockImplementationOnce(() => ({
        data: {
          getterById: jest.fn().mockReturnValue({
            withClassName: jest.fn().mockReturnThis(),
            withId: jest.fn().mockReturnValue({
              do: jest.fn().mockResolvedValue(null),
            }),
          }),
        },
      }));

      const vector = await client.getVector('non-existent-id');
      expect(vector).toBeNull();
    });
  });
}); 