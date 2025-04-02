/**
 * Test Environment Setup
 * 
 * This module provides utilities for setting up and managing the test environment,
 * including database connections and cleanup.
 */

import { SensoryMemoryClient } from '../../src/database/redis/client';
import { WorkingMemoryClient } from '../../src/database/postgres/client';
import { SemanticMemoryClient } from '../../src/database/neo4j/client';
import { VectorStorageClient } from '../../src/database/weaviate/client';
import { LongTermMemoryClient } from '../../src/database/mongodb/client';
import { RedisConfigSchema } from '../../src/database/redis/config';
import { PostgresConfigSchema } from '../../src/database/postgres/config';
import { Neo4jConfigSchema } from '../../src/database/neo4j/config';
import { WeaviateConfigSchema } from '../../src/database/weaviate/config';
import { MongoDBConfigSchema } from '../../src/database/mongodb/config';

// Test configuration values
const testConfigs = {
  redis: RedisConfigSchema.parse({
    host: 'localhost',
    port: 6379,
    db: 0,
    keyPrefix: 'test:sensory:',
  }),
  postgres: PostgresConfigSchema.parse({
    host: 'localhost',
    port: 5432,
    database: 'collabsphere_test',
    user: 'test_user',
    password: 'test_password',
  }),
  neo4j: Neo4jConfigSchema.parse({
    uri: 'bolt://localhost:7687',
    user: 'test_user',
    password: 'test_password',
  }),
  weaviate: WeaviateConfigSchema.parse({
    host: 'http://localhost:8080',
    port: 8080,
    scheme: 'http',
  }),
  mongodb: MongoDBConfigSchema.parse({
    uri: 'mongodb://localhost:27017',
    database: 'collabsphere_test',
  }),
};

export class TestEnvironment {
  private static instance: TestEnvironment;
  private redisClient: SensoryMemoryClient;
  private postgresClient: WorkingMemoryClient;
  private neo4jClient: SemanticMemoryClient;
  private weaviateClient: VectorStorageClient;
  private mongodbClient: LongTermMemoryClient;

  private constructor() {
    this.redisClient = new SensoryMemoryClient(testConfigs.redis);
    this.postgresClient = new WorkingMemoryClient(testConfigs.postgres);
    this.neo4jClient = new SemanticMemoryClient(testConfigs.neo4j);
    this.weaviateClient = new VectorStorageClient(testConfigs.weaviate);
    this.mongodbClient = new LongTermMemoryClient(testConfigs.mongodb);
  }

  public static getInstance(): TestEnvironment {
    if (!TestEnvironment.instance) {
      TestEnvironment.instance = new TestEnvironment();
    }
    return TestEnvironment.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize Redis
      await this.redisClient.cleanup();

      // Initialize PostgreSQL
      await this.postgresClient.cleanup();

      // Initialize Neo4j
      await this.neo4jClient.cleanup();

      // Initialize Weaviate
      await this.weaviateClient.cleanup();

      // Initialize MongoDB
      await this.mongodbClient.cleanup();

      console.log('Test environment initialized successfully');
    } catch (error) {
      console.error('Failed to initialize test environment:', error);
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    try {
      // Cleanup all databases
      await Promise.all([
        this.redisClient.cleanup(),
        this.postgresClient.cleanup(),
        this.neo4jClient.cleanup(),
        this.weaviateClient.cleanup(),
        this.mongodbClient.cleanup(),
      ]);

      console.log('Test environment cleaned up successfully');
    } catch (error) {
      console.error('Failed to cleanup test environment:', error);
      throw error;
    }
  }

  public getRedisClient(): SensoryMemoryClient {
    return this.redisClient;
  }

  public getPostgresClient(): WorkingMemoryClient {
    return this.postgresClient;
  }

  public getNeo4jClient(): SemanticMemoryClient {
    return this.neo4jClient;
  }

  public getWeaviateClient(): VectorStorageClient {
    return this.weaviateClient;
  }

  public getMongoDBClient(): LongTermMemoryClient {
    return this.mongodbClient;
  }
}

// Global test environment instance
let testEnv: TestEnvironment;

// Setup before all tests
beforeAll(async () => {
  testEnv = TestEnvironment.getInstance();
  await testEnv.initialize();
});

// Cleanup after all tests
afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

// Export the test environment for use in individual test files
export { testEnv }; 