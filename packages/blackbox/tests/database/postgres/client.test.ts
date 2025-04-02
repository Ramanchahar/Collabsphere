/**
 * Tests for PostgreSQL Client Implementation
 */

import { Pool, QueryResult, PoolClient } from 'pg';
import { WorkingMemoryClient } from '../../../src/database/postgres/client';
import { StandardizedChunk, ContentType } from '../../../src/shared/types/standardized-chunk';

// Mock pg Pool
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
    query: jest.fn(),
    end: jest.fn(),
  })),
}));

describe('WorkingMemoryClient', () => {
  let client: WorkingMemoryClient;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new WorkingMemoryClient();
    mockPool = new Pool() as jest.Mocked<Pool>;
    // Fix the type of connect and query methods
    (mockPool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    } as unknown as PoolClient);
    (mockPool.query as jest.Mock).mockResolvedValue({
      rows: [],
      command: 'SELECT',
      rowCount: 0,
      oid: 0,
      fields: [],
    } as QueryResult);
  });

  describe('initialize', () => {
    it('should create tables and indexes', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      } as unknown as PoolClient;
      (mockPool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

      await client.initialize();

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledTimes(4); // 4 tables
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('storeChunk', () => {
    const mockChunk: StandardizedChunk = {
      id: 'test-chunk-1',
      connectorId: 'test-connector',
      content: 'Test content',
      contentType: ContentType.TEXT,
      source: {
        type: 'test',
        id: 'test-source',
        url: 'http://test.com',
        container: 'test-container',
        title: 'Test Title',
      },
      processedAt: new Date().toISOString(),
      author: {
        id: 'test-author',
        name: 'Test Author',
        email: 'test@example.com',
      },
      projectId: 'test-project',
      context: {
        topics: ['test-topic'],
        tags: ['test-tag'],
        language: 'en',
      },
      position: {
        documentId: 'test-doc',
        path: ['test-path'],
        previousChunkId: 'prev-chunk',
        nextChunkId: 'next-chunk',
        order: 1,
      },
      relationships: [
        {
          targetId: 'target-1',
          type: 'related',
        },
      ],
      rawMetadata: {
        test: 'value',
      },
    };

    it('should store a chunk and initialize processing status', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      } as unknown as PoolClient;
      (mockPool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

      await client.storeChunk(mockChunk);

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO working_memory_chunks'),
        expect.any(Array)
      );
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO processing_status'),
        [mockChunk.id]
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle errors and rollback transaction', async () => {
      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce(undefined) // BEGIN
          .mockRejectedValueOnce(new Error('Test error')), // INSERT chunk
        release: jest.fn(),
      } as unknown as PoolClient;
      (mockPool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

      await expect(client.storeChunk(mockChunk)).rejects.toThrow('Test error');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    });
  });

  describe('getChunk', () => {
    it('should return null for non-existent chunk', async () => {
      const mockResult: QueryResult = {
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await client.getChunk('non-existent');

      expect(result).toBeNull();
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM working_memory_chunks'),
        ['non-existent']
      );
    });

    it('should return chunk for existing chunk', async () => {
      const mockRow = {
        id: 'test-chunk-1',
        connector_id: 'test-connector',
        content: 'Test content',
        content_type: ContentType.TEXT,
        source_type: 'test',
        source_id: 'test-source',
        source_url: 'http://test.com',
        source_container: 'test-container',
        source_title: 'Test Title',
        created_at: '2024-01-01T00:00:00Z',
        modified_at: '2024-01-01T00:00:00Z',
        processed_at: '2024-01-01T00:00:00Z',
        author_id: 'test-author',
        author_name: 'Test Author',
        author_email: 'test@example.com',
        project_id: 'test-project',
        topics: ['test-topic'],
        tags: ['test-tag'],
        language: 'en',
        document_id: 'test-doc',
        path: ['test-path'],
        previous_chunk_id: 'prev-chunk',
        next_chunk_id: 'next-chunk',
        chunk_order: 1,
        relationships: JSON.stringify([{ targetId: 'target-1', type: 'related' }]),
        raw_metadata: JSON.stringify({ test: 'value' }),
      };

      const mockResult: QueryResult = {
        rows: [mockRow],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await client.getChunk('test-chunk-1');

      expect(result).toEqual({
        id: mockRow.id,
        connectorId: mockRow.connector_id,
        content: mockRow.content,
        contentType: mockRow.content_type,
        source: {
          type: mockRow.source_type,
          id: mockRow.source_id,
          url: mockRow.source_url,
          container: mockRow.source_container,
          title: mockRow.source_title,
        },
        created: mockRow.created_at,
        modified: mockRow.modified_at,
        processedAt: mockRow.processed_at,
        author: {
          id: mockRow.author_id,
          name: mockRow.author_name,
          email: mockRow.author_email,
        },
        projectId: mockRow.project_id,
        context: {
          topics: mockRow.topics,
          tags: mockRow.tags,
          language: mockRow.language,
        },
        position: {
          documentId: mockRow.document_id,
          path: mockRow.path,
          previousChunkId: mockRow.previous_chunk_id,
          nextChunkId: mockRow.next_chunk_id,
          order: mockRow.chunk_order,
        },
        relationships: JSON.parse(mockRow.relationships),
        rawMetadata: JSON.parse(mockRow.raw_metadata),
      });
    });
  });

  describe('updateProcessingStatus', () => {
    it('should update processing status with retry logic', async () => {
      await client.updateProcessingStatus('test-chunk-1', 'failed', 'Test error', 1);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE processing_status'),
        ['failed', 'Test error', 1, 'test-chunk-1']
      );
    });
  });

  describe('storeConfidenceScores', () => {
    it('should store confidence scores', async () => {
      const scores = {
        confidence: 0.8,
        doubt: 0.2,
        quality: 0.9,
        credibility: 0.85,
        usage: 0.75,
        technical: 0.7,
        deprecation: 0.1,
        incompleteness: 0.15,
        contradiction: 0.05,
        obsolescence: 0.1,
      };

      await client.storeConfidenceScores('test-chunk-1', scores);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO confidence_scores'),
        [
          'test-chunk-1',
          scores.confidence,
          scores.doubt,
          scores.quality,
          scores.credibility,
          scores.usage,
          scores.technical,
          scores.deprecation,
          scores.incompleteness,
          scores.contradiction,
          scores.obsolescence,
        ]
      );
    });
  });

  describe('getPendingChunks', () => {
    it('should return pending chunks', async () => {
      const mockRows = [
        {
          id: 'test-chunk-1',
          connector_id: 'test-connector',
          content: 'Test content',
          content_type: ContentType.TEXT,
          source_type: 'test',
          source_id: 'test-source',
          source_url: 'http://test.com',
          source_container: 'test-container',
          source_title: 'Test Title',
          created_at: '2024-01-01T00:00:00Z',
          modified_at: '2024-01-01T00:00:00Z',
          processed_at: '2024-01-01T00:00:00Z',
          author_id: 'test-author',
          author_name: 'Test Author',
          author_email: 'test@example.com',
          project_id: 'test-project',
          topics: ['test-topic'],
          tags: ['test-tag'],
          language: 'en',
          document_id: 'test-doc',
          path: ['test-path'],
          previous_chunk_id: 'prev-chunk',
          next_chunk_id: 'next-chunk',
          chunk_order: 1,
          relationships: JSON.stringify([{ targetId: 'target-1', type: 'related' }]),
          raw_metadata: JSON.stringify({ test: 'value' }),
        },
      ];

      const mockResult: QueryResult = {
        rows: mockRows,
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      };
      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await client.getPendingChunks(10);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockRows[0].id,
        connectorId: mockRows[0].connector_id,
        content: mockRows[0].content,
        contentType: mockRows[0].content_type,
        source: {
          type: mockRows[0].source_type,
          id: mockRows[0].source_id,
          url: mockRows[0].source_url,
          container: mockRows[0].source_container,
          title: mockRows[0].source_title,
        },
        created: mockRows[0].created_at,
        modified: mockRows[0].modified_at,
        processedAt: mockRows[0].processed_at,
        author: {
          id: mockRows[0].author_id,
          name: mockRows[0].author_name,
          email: mockRows[0].author_email,
        },
        projectId: mockRows[0].project_id,
        context: {
          topics: mockRows[0].topics,
          tags: mockRows[0].tags,
          language: mockRows[0].language,
        },
        position: {
          documentId: mockRows[0].document_id,
          path: mockRows[0].path,
          previousChunkId: mockRows[0].previous_chunk_id,
          nextChunkId: mockRows[0].next_chunk_id,
          order: mockRows[0].chunk_order,
        },
        relationships: JSON.parse(mockRows[0].relationships),
        rawMetadata: JSON.parse(mockRows[0].raw_metadata),
      });
    });
  });

  describe('updateBatchStatus', () => {
    it('should update batch status', async () => {
      await client.updateBatchStatus('test-batch-1', 'completed', 10);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE batch_tracking'),
        ['completed', 10, undefined, 'test-batch-1']
      );
    });
  });

  describe('close', () => {
    it('should close the connection pool', async () => {
      await client.close();
      expect(mockPool.end).toHaveBeenCalled();
    });
  });
}); 