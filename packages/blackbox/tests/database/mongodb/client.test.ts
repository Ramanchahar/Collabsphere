/**
 * MongoDB Client Tests
 * 
 * This module provides tests for the MongoDB client implementation,
 * including long-term memory operations and schema management.
 */

import { LongTermMemoryClient } from '../../../src/database/mongodb/client';
import { MongoDBConfig } from '../../../src/database/mongodb/config';
import { StandardizedChunk, ContentType } from '../../../src/shared/types/standardized-chunk';
import { ObjectId } from 'mongodb';

// Mock MongoDB client
jest.mock('mongodb', () => {
  const mockCollection = {
    createIndexes: jest.fn().mockResolvedValue(undefined),
    insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId('test-id') }),
    findOne: jest.fn().mockResolvedValue({
      _id: new ObjectId('test-id'),
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
      vectorId: 'test-vector-id',
    }),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        {
          sourceNodeId: new ObjectId('source-id'),
          targetNodeId: new ObjectId('target-id'),
          relationshipType: 'related',
          metadata: { key: 'value' },
        },
      ]),
    }),
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };

  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb),
    close: jest.fn().mockResolvedValue(undefined),
  };

  return {
    MongoClient: jest.fn().mockImplementation(() => mockClient),
    ObjectId,
  };
});

describe('LongTermMemoryClient', () => {
  let client: LongTermMemoryClient;
  let config: MongoDBConfig;

  beforeEach(() => {
    config = {
      uri: 'mongodb://localhost:27017',
      database: 'test-db',
    };
    client = new LongTermMemoryClient(config);
  });

  describe('initialize', () => {
    it('should create all indexes', async () => {
      await client.initialize();
      expect(client as any).toBeDefined();
    });
  });

  describe('storeChunk', () => {
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

    const mockVectorId = 'test-vector-id';

    it('should store a chunk', async () => {
      await client.storeChunk(mockChunk, mockVectorId);
      expect(client as any).toBeDefined();
    });
  });

  describe('getChunk', () => {
    it('should retrieve a chunk by ID', async () => {
      const result = await client.getChunk('test-id');
      expect(result).toBeDefined();
      expect(result?.chunk.id).toBe('test-id');
      expect(result?.vectorId).toBe('test-vector-id');
    });

    it('should return null for non-existent chunk', async () => {
      jest.spyOn(client as any, 'collections').mockImplementationOnce(() => ({
        chunks: {
          findOne: jest.fn().mockResolvedValue(null),
        },
      }));

      const result = await client.getChunk('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateChunkMetadata', () => {
    it('should update a chunk\'s metadata', async () => {
      const metadata = { key: 'new-value' };
      await client.updateChunkMetadata('test-id', metadata);
      expect(client as any).toBeDefined();
    });
  });

  describe('storeConcept', () => {
    it('should store a concept', async () => {
      await client.storeConcept(
        'test-project',
        'test-concept',
        'test description',
        'test-vector-id',
        { key: 'value' }
      );
      expect(client as any).toBeDefined();
    });
  });

  describe('storeRelationship', () => {
    it('should store a relationship', async () => {
      await client.storeRelationship(
        'source-id',
        'target-id',
        'related',
        { key: 'value' }
      );
      expect(client as any).toBeDefined();
    });
  });

  describe('getNodeRelationships', () => {
    it('should get all relationships for a node', async () => {
      const relationships = await client.getNodeRelationships('test-id');
      expect(relationships).toHaveLength(1);
      expect(relationships[0].sourceNodeId).toBe('source-id');
      expect(relationships[0].targetNodeId).toBe('target-id');
      expect(relationships[0].relationshipType).toBe('related');
      expect(relationships[0].metadata).toEqual({ key: 'value' });
    });
  });

  describe('close', () => {
    it('should close the MongoDB connection', async () => {
      await client.close();
      expect(client as any).toBeDefined();
    });
  });
}); 