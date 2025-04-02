import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import neo4j from 'neo4j-driver';
import weaviate from 'weaviate-ts-client';
import { Pool } from 'pg';

// Global test timeout
jest.setTimeout(30000);

// Mock database connections for testing
jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    close: jest.fn(),
    db: jest.fn(),
  })),
}));

jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

jest.mock('neo4j-driver', () => ({
  default: {
    driver: jest.fn().mockImplementation(() => ({
      session: jest.fn().mockImplementation(() => ({
        run: jest.fn(),
        close: jest.fn(),
      })),
      close: jest.fn(),
    })),
  },
}));

jest.mock('weaviate-ts-client', () => ({
  default: {
    client: jest.fn().mockImplementation(() => ({
      data: jest.fn(),
      batch: jest.fn(),
    })),
  },
}));

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    end: jest.fn(),
    query: jest.fn(),
  })),
}));

// Global test utilities
global.mockMongoClient = MongoClient as jest.MockedClass<typeof MongoClient>;
global.mockRedisClient = createClient as jest.MockedFunction<typeof createClient>;
global.mockNeo4jDriver = neo4j as jest.Mocked<typeof neo4j>;
global.mockWeaviateClient = weaviate as jest.Mocked<typeof weaviate>;
global.mockPgPool = Pool as jest.MockedClass<typeof Pool>;

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global type declarations
declare global {
  var mockMongoClient: jest.MockedClass<typeof MongoClient>;
  var mockRedisClient: jest.MockedFunction<typeof createClient>;
  var mockNeo4jDriver: jest.Mocked<typeof neo4j>;
  var mockWeaviateClient: jest.Mocked<typeof weaviate>;
  var mockPgPool: jest.MockedClass<typeof Pool>;
} 