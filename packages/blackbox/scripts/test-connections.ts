/**
 * Database Connection Test Script
 * 
 * This script tests connections and basic operations for all databases
 * used in the Blackbox system.
 */

import { SensoryMemoryClient } from '../src/database/redis/client';
import { WorkingMemoryClient } from '../src/database/postgres/client';
import { SemanticMemoryClient } from '../src/database/neo4j/client';
import { VectorStorageClient } from '../src/database/weaviate/client';
import { LongTermMemoryClient } from '../src/database/mongodb/client';
import { RedisConfigSchema } from '../src/database/redis/config';
import { PostgresConfigSchema } from '../src/database/postgres/config';
import { Neo4jConfigSchema } from '../src/database/neo4j/config';
import { WeaviateConfigSchema } from '../src/database/weaviate/config';
import { MongoDBConfigSchema } from '../src/database/mongodb/config';
import { ContentType } from '../src/shared/types/standardized-chunk';

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
    port: 5433,
    database: 'collabsphere_test',
    user: 'test_user',
    password: 'test_password',
  }),
  neo4j: Neo4jConfigSchema.parse({
    uri: 'bolt://localhost:7688',
    user: 'neo4j',
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

async function testRedis() {
  console.log('\nTesting Redis connection...');
  const client = new SensoryMemoryClient(testConfigs.redis);
  
  try {
    // Test basic operations
    await client.storeRawChunk({
      id: 'test-chunk-1',
      content: 'Test content',
      contentType: ContentType.TEXT,
      projectId: 'test-project',
      connectorId: 'test-connector',
      processedAt: new Date().toISOString(),
      source: {
        id: 'test-source',
        type: 'test',
      },
    });

    const chunk = await client.getRawChunk('test-chunk-1');
    console.log('✅ Redis test passed:', chunk ? 'Chunk retrieved successfully' : 'Failed to retrieve chunk');
    
    await client.cleanup();
  } catch (error) {
    console.error('❌ Redis test failed:', error);
  }
}

async function testPostgres() {
  console.log('\nTesting PostgreSQL connection...');
  const client = new WorkingMemoryClient(testConfigs.postgres);
  
  try {
    // Initialize schema
    await client.initialize();
    
    // Test basic operations
    await client.storeChunk({
      id: 'test-chunk-1',
      content: 'Test content',
      contentType: ContentType.TEXT,
      projectId: 'test-project',
      connectorId: 'test-connector',
      processedAt: new Date().toISOString(),
      source: {
        id: 'test-source',
        type: 'test',
      },
    });

    const chunk = await client.getChunk('test-chunk-1');
    console.log('✅ PostgreSQL test passed:', chunk ? 'Chunk retrieved successfully' : 'Failed to retrieve chunk');
    
    await client.cleanup();
  } catch (error) {
    console.error('❌ PostgreSQL test failed:', error);
  }
}

async function testNeo4j() {
  console.log('\nTesting Neo4j connection...');
  const client = new SemanticMemoryClient(testConfigs.neo4j);
  
  try {
    // Initialize schema
    await client.initialize();
    
    // Test basic operations
    await client.storeKnowledge({
      id: 'test-chunk-1',
      content: 'Test content',
      contentType: ContentType.TEXT,
      projectId: 'test-project',
      connectorId: 'test-connector',
      processedAt: new Date().toISOString(),
      source: {
        id: 'test-source',
        type: 'test',
      },
    });

    const chunk = await client.getKnowledge('test-chunk-1');
    console.log('✅ Neo4j test passed:', chunk ? 'Chunk retrieved successfully' : 'Failed to retrieve chunk');
    
    await client.cleanup();
  } catch (error) {
    console.error('❌ Neo4j test failed:', error);
  }
}

async function testWeaviate() {
  console.log('\nTesting Weaviate connection...');
  const client = new VectorStorageClient(testConfigs.weaviate);
  
  try {
    // Initialize schema
    await client.initialize();
    
    // Test basic operations
    const testVector = new Array(1536).fill(0.1); // Example vector
    await client.storeVectorChunk({
      id: 'test-chunk-1',
      content: 'Test content',
      contentType: ContentType.TEXT,
      projectId: 'test-project',
      connectorId: 'test-connector',
      processedAt: new Date().toISOString(),
      source: {
        id: 'test-source',
        type: 'test',
      },
    }, testVector);

    const chunk = await client.getVectorChunk('test-chunk-1');
    console.log('✅ Weaviate test passed:', chunk ? 'Chunk retrieved successfully' : 'Failed to retrieve chunk');
    
    await client.cleanup();
  } catch (error) {
    console.error('❌ Weaviate test failed:', error);
  }
}

async function testMongoDB() {
  console.log('\nTesting MongoDB connection...');
  const client = new LongTermMemoryClient(testConfigs.mongodb);
  
  try {
    // Initialize schema
    await client.initialize();
    
    // Test basic operations
    await client.storeChunk({
      id: 'test-chunk-1',
      content: 'Test content',
      contentType: ContentType.TEXT,
      projectId: 'test-project',
      connectorId: 'test-connector',
      processedAt: new Date().toISOString(),
      source: {
        id: 'test-source',
        type: 'test',
      },
    }, 'test-vector-id');

    const chunk = await client.getChunk('test-chunk-1');
    console.log('✅ MongoDB test passed:', chunk ? 'Chunk retrieved successfully' : 'Failed to retrieve chunk');
    
    await client.cleanup();
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
  }
}

async function main() {
  console.log('Starting database connection tests...\n');
  
  await testRedis();
  await testPostgres();
  await testNeo4j();
  await testWeaviate();
  await testMongoDB();
  
  console.log('\nAll database tests completed!');
}

main().catch(console.error); 