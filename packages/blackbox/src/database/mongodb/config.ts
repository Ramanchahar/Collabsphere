/**
 * MongoDB Database Configuration
 * 
 * This module provides configuration for MongoDB database connections and schema definitions
 * for long-term memory storage operations.
 */

import { z } from 'zod';
import { MongoClient, MongoClientOptions } from 'mongodb';

// MongoDB configuration schema
export const MongoDBConfigSchema = z.object({
  uri: z.string().url(),
  database: z.string().default('collabsphere_long_term_memory'),
  options: z.object({
    maxPoolSize: z.number().int().positive().default(10),
    minPoolSize: z.number().int().positive().default(5),
    maxIdleTimeMS: z.number().int().positive().default(30000),
    connectTimeoutMS: z.number().int().positive().default(10000),
    socketTimeoutMS: z.number().int().positive().default(45000),
    retryWrites: z.boolean().default(true),
    retryReads: z.boolean().default(true),
  }).optional(),
});

export type MongoDBConfig = z.infer<typeof MongoDBConfigSchema>;

// Default configuration
export const defaultMongoDBConfig: MongoDBConfig = {
  uri: 'mongodb://localhost:27017',
  database: 'collabsphere_long_term_memory',
  options: {
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
  },
};

// MongoDB client creation function
export function createMongoDBClient(config: MongoDBConfig): MongoClient {
  return new MongoClient(config.uri, config.options as MongoClientOptions);
}

// Field names for MongoDB collections
const FIELD_NAMES = {
  ID: '_id',
  CONTENT: 'content',
  CONTENT_TYPE: 'contentType',
  PROJECT_ID: 'projectId',
  CONNECTOR_ID: 'connectorId',
  PROCESSED_AT: 'processedAt',
  METADATA: 'metadata',
  SOURCE_ID: 'sourceId',
  SOURCE_TYPE: 'sourceType',
  SOURCE_URL: 'sourceUrl',
  SOURCE_CONTAINER: 'sourceContainer',
  SOURCE_TITLE: 'sourceTitle',
  NAME: 'name',
  DESCRIPTION: 'description',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  VECTOR_ID: 'vectorId',
  CONFIDENCE_SCORE: 'confidenceScore',
  DOUBT_SCORE: 'doubtScore',
  RELATIONSHIP_TYPE: 'relationshipType',
  SOURCE_NODE_ID: 'sourceNodeId',
  TARGET_NODE_ID: 'targetNodeId',
};

// MongoDB schema definitions
export const MongoDBSchema = {
  // Collection names
  COLLECTION_NAMES: {
    LONG_TERM_CHUNK: 'long_term_chunks',
    LONG_TERM_CONCEPT: 'long_term_concepts',
    LONG_TERM_SOURCE: 'long_term_sources',
    LONG_TERM_PROJECT: 'long_term_projects',
    LONG_TERM_RELATIONSHIP: 'long_term_relationships',
  },

  // Field names
  FIELD_NAMES,

  // Index definitions
  INDEXES: {
    LONG_TERM_CHUNK: [
      { key: { [FIELD_NAMES.PROJECT_ID]: 1 } },
      { key: { [FIELD_NAMES.CONNECTOR_ID]: 1 } },
      { key: { [FIELD_NAMES.PROCESSED_AT]: 1 } },
      { key: { [FIELD_NAMES.VECTOR_ID]: 1 }, unique: true },
    ],
    LONG_TERM_CONCEPT: [
      { key: { [FIELD_NAMES.PROJECT_ID]: 1 } },
      { key: { [FIELD_NAMES.NAME]: 1 } },
      { key: { [FIELD_NAMES.VECTOR_ID]: 1 }, unique: true },
    ],
    LONG_TERM_SOURCE: [
      { key: { [FIELD_NAMES.SOURCE_ID]: 1 }, unique: true },
      { key: { [FIELD_NAMES.SOURCE_TYPE]: 1 } },
      { key: { [FIELD_NAMES.VECTOR_ID]: 1 }, unique: true },
    ],
    LONG_TERM_PROJECT: [
      { key: { [FIELD_NAMES.ID]: 1 }, unique: true },
      { key: { [FIELD_NAMES.VECTOR_ID]: 1 }, unique: true },
    ],
    LONG_TERM_RELATIONSHIP: [
      { key: { [FIELD_NAMES.SOURCE_NODE_ID]: 1 } },
      { key: { [FIELD_NAMES.TARGET_NODE_ID]: 1 } },
      { key: { [FIELD_NAMES.RELATIONSHIP_TYPE]: 1 } },
    ],
  },
}; 