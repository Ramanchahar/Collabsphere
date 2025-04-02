/**
 * Neo4j Client Tests
 * 
 * This module contains tests for the Neo4j client implementation.
 */

import { SemanticMemoryClient } from '../../../src/database/neo4j/client';
import { Neo4jConfig } from '../../../src/database/neo4j/config';
import { StandardizedChunk } from '../../../src/shared/types/standardized-chunk';

// Mock Neo4j driver
jest.mock('neo4j-driver', () => {
  const mockSession = {
    close: jest.fn(),
    run: jest.fn(),
    readTransaction: jest.fn(),
    writeTransaction: jest.fn(),
  };

  const mockDriver = {
    session: jest.fn().mockReturnValue(mockSession),
    close: jest.fn(),
  };

  return {
    driver: jest.fn().mockReturnValue(mockDriver),
    auth: {
      basic: jest.fn(),
    },
  };
});

describe('SemanticMemoryClient', () => {
  let client: SemanticMemoryClient;
  let mockConfig: Neo4jConfig;

  beforeEach(() => {
    mockConfig = {
      uri: 'bolt://localhost:7687',
      user: 'neo4j',
      password: 'test-password',
      maxConnectionPoolSize: 50,
      connectionTimeout: 30000,
      maxTransactionRetryTime: 30000,
    };

    client = new SemanticMemoryClient(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should create indexes and constraints', async () => {
      const mockSession = {
        close: jest.fn(),
        run: jest.fn().mockResolvedValue({}),
      };

      (client as any).driver.session.mockReturnValue(mockSession);

      await client.initialize();

      expect(mockSession.run).toHaveBeenCalledTimes(12); // 8 indexes + 4 constraints
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('storeKnowledge', () => {
    const mockChunk: StandardizedChunk = {
      id: 'test-id',
      connectorId: 'test-connector',
      content: 'test content',
      contentType: 'text',
      projectId: 'test-project',
      processedAt: new Date().toISOString(),
      rawMetadata: { test: 'metadata' },
      source: {
        id: 'test-source',
        type: 'document',
        url: 'http://test.com',
        container: 'test-container',
        title: 'Test Document',
      },
    };

    it('should store knowledge node with source', async () => {
      const mockSession = {
        close: jest.fn(),
        writeTransaction: jest.fn().mockImplementation(async (callback) => {
          const mockTx = {
            run: jest.fn().mockResolvedValue({}),
          };
          await callback(mockTx);
        }),
      };

      (client as any).driver.session.mockReturnValue(mockSession);

      await client.storeKnowledge(mockChunk);

      expect(mockSession.writeTransaction).toHaveBeenCalled();
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('getKnowledge', () => {
    it('should return null when knowledge node not found', async () => {
      const mockSession = {
        close: jest.fn(),
        readTransaction: jest.fn().mockImplementation(async (callback) => {
          const mockTx = {
            run: jest.fn().mockResolvedValue({ records: [] }),
          };
          return await callback(mockTx);
        }),
      };

      (client as any).driver.session.mockReturnValue(mockSession);

      const result = await client.getKnowledge('non-existent-id');

      expect(result).toBeNull();
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return knowledge node when found', async () => {
      const mockRecord = {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'k') {
            return {
              properties: {
                id: 'test-id',
                connectorId: 'test-connector',
                content: 'test content',
                contentType: 'text',
                projectId: 'test-project',
                processedAt: new Date().toISOString(),
                metadata: { test: 'metadata' },
              },
            };
          }
          if (key === 's') {
            return {
              properties: {
                id: 'test-source',
                type: 'document',
                url: 'http://test.com',
                container: 'test-container',
                title: 'Test Document',
              },
            };
          }
          return null;
        }),
      };

      const mockSession = {
        close: jest.fn(),
        readTransaction: jest.fn().mockImplementation(async (callback) => {
          const mockTx = {
            run: jest.fn().mockResolvedValue({ records: [mockRecord] }),
          };
          return await callback(mockTx);
        }),
      };

      (client as any).driver.session.mockReturnValue(mockSession);

      const result = await client.getKnowledge('test-id');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-id');
      expect(result?.source).toBeDefined();
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('createRelationship', () => {
    it('should create relationship between knowledge nodes', async () => {
      const mockSession = {
        close: jest.fn(),
        writeTransaction: jest.fn().mockImplementation(async (callback) => {
          const mockTx = {
            run: jest.fn().mockResolvedValue({}),
          };
          await callback(mockTx);
        }),
      };

      (client as any).driver.session.mockReturnValue(mockSession);

      await client.createRelationship('source-id', 'target-id', 'RELATES_TO');

      expect(mockSession.writeTransaction).toHaveBeenCalled();
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('findSimilar', () => {
    it('should return similar knowledge nodes', async () => {
      const mockRecord = {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'k') {
            return {
              properties: {
                id: 'test-id',
                connectorId: 'test-connector',
                content: 'test content',
                contentType: 'text',
                projectId: 'test-project',
                processedAt: new Date().toISOString(),
                metadata: { test: 'metadata' },
              },
            };
          }
          return null;
        }),
      };

      const mockSession = {
        close: jest.fn(),
        readTransaction: jest.fn().mockImplementation(async (callback) => {
          const mockTx = {
            run: jest.fn().mockResolvedValue({ records: [mockRecord] }),
          };
          return await callback(mockTx);
        }),
      };

      (client as any).driver.session.mockReturnValue(mockSession);

      const results = await client.findSimilar('test-project', 'test', 'text');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('test-id');
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('getRelated', () => {
    it('should return related knowledge nodes', async () => {
      const mockRecord = {
        get: jest.fn().mockImplementation((key) => {
          if (key === 'related') {
            return {
              properties: {
                id: 'test-id',
                connectorId: 'test-connector',
                content: 'test content',
                contentType: 'text',
                projectId: 'test-project',
                processedAt: new Date().toISOString(),
                metadata: { test: 'metadata' },
              },
            };
          }
          return null;
        }),
      };

      const mockSession = {
        close: jest.fn(),
        readTransaction: jest.fn().mockImplementation(async (callback) => {
          const mockTx = {
            run: jest.fn().mockResolvedValue({ records: [mockRecord] }),
          };
          return await callback(mockTx);
        }),
      };

      (client as any).driver.session.mockReturnValue(mockSession);

      const results = await client.getRelated('test-id');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('test-id');
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close the Neo4j driver connection', async () => {
      await client.close();
      expect((client as any).driver.close).toHaveBeenCalled();
    });
  });
}); 