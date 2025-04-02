/**
 * Weaviate Database Configuration
 * 
 * This module provides configuration for Weaviate database connections and schema definitions
 * for vector storage operations.
 */

import { z } from 'zod';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

// Weaviate configuration schema
export const WeaviateConfigSchema = z.object({
  host: z.string().url(),
  port: z.number().int().positive().default(8080),
  scheme: z.enum(['http', 'https']).default('http'),
  apiKey: z.string().optional(),
  timeoutSeconds: z.number().int().positive().default(30),
  additionalHeaders: z.record(z.string()).optional(),
});

export type WeaviateConfig = z.infer<typeof WeaviateConfigSchema>;

// Default configuration
export const defaultWeaviateConfig: WeaviateConfig = {
  host: 'http://localhost',
  port: 8080,
  scheme: 'http',
  timeoutSeconds: 30,
};

// Weaviate client creation function
export function createWeaviateClient(config: WeaviateConfig): WeaviateClient {
  return weaviate.client({
    scheme: config.scheme,
    host: config.host.replace(/^https?:\/\//, ''),
    ...(config.apiKey && { apiKey: new ApiKey(config.apiKey) }),
    ...(config.additionalHeaders && { headers: config.additionalHeaders }),
  });
}

// Weaviate schema definitions
export const WeaviateSchema = {
  // Class names
  CLASS_NAMES: {
    VECTOR_CHUNK: 'VectorChunk',
    VECTOR_CONCEPT: 'VectorConcept',
    VECTOR_SOURCE: 'VectorSource',
    VECTOR_PROJECT: 'VectorProject',
  },

  // Property names
  PROPERTY_NAMES: {
    ID: 'id',
    CONTENT: 'content',
    CONTENT_TYPE: 'contentType',
    PROJECT_ID: 'projectId',
    CONNECTOR_ID: 'connectorId',
    PROCESSED_AT: 'processedAt',
    METADATA: 'metadata',
    VECTOR: 'vector',
    SOURCE_ID: 'sourceId',
    SOURCE_TYPE: 'sourceType',
    SOURCE_URL: 'sourceUrl',
    SOURCE_CONTAINER: 'sourceContainer',
    SOURCE_TITLE: 'sourceTitle',
    NAME: 'name',
    DESCRIPTION: 'description',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
  },

  // Class schemas
  CLASS_SCHEMAS: {
    VECTOR_CHUNK: {
      class: 'VectorChunk',
      description: 'A vectorized chunk of content with its metadata',
      vectorizer: 'text2vec-contextionary',
      properties: [
        { name: 'id', dataType: ['text'] },
        { name: 'content', dataType: ['text'] },
        { name: 'contentType', dataType: ['text'] },
        { name: 'projectId', dataType: ['text'] },
        { name: 'connectorId', dataType: ['text'] },
        { name: 'processedAt', dataType: ['date'] },
        { name: 'metadata', dataType: ['object'] },
        { name: 'sourceId', dataType: ['text'] },
        { name: 'sourceType', dataType: ['text'] },
        { name: 'sourceUrl', dataType: ['text'] },
        { name: 'sourceContainer', dataType: ['text'] },
        { name: 'sourceTitle', dataType: ['text'] },
      ],
      vectorIndexConfig: {
        distance: 'cosine',
        ef: 100,
        maxConnections: 16,
        efConstruction: 100,
        m: 16,
        dynamicEfMin: 100,
        dynamicEfMax: 500,
        dynamicEfFactor: 8,
        skip: false,
        vectorCacheMaxObjects: 100000,
      },
    },
    VECTOR_CONCEPT: {
      class: 'VectorConcept',
      description: 'A vectorized concept with its relationships',
      vectorizer: 'text2vec-contextionary',
      properties: [
        { name: 'id', dataType: ['text'] },
        { name: 'name', dataType: ['text'] },
        { name: 'description', dataType: ['text'] },
        { name: 'projectId', dataType: ['text'] },
        { name: 'metadata', dataType: ['object'] },
      ],
      vectorIndexConfig: {
        distance: 'cosine',
        ef: 100,
        maxConnections: 16,
        efConstruction: 100,
        m: 16,
        dynamicEfMin: 100,
        dynamicEfMax: 500,
        dynamicEfFactor: 8,
        skip: false,
        vectorCacheMaxObjects: 100000,
      },
    },
    VECTOR_SOURCE: {
      class: 'VectorSource',
      description: 'A vectorized source with its metadata',
      vectorizer: 'text2vec-contextionary',
      properties: [
        { name: 'id', dataType: ['text'] },
        { name: 'type', dataType: ['text'] },
        { name: 'url', dataType: ['text'] },
        { name: 'container', dataType: ['text'] },
        { name: 'title', dataType: ['text'] },
        { name: 'lastModified', dataType: ['date'] },
        { name: 'metadata', dataType: ['object'] },
      ],
      vectorIndexConfig: {
        distance: 'cosine',
        ef: 100,
        maxConnections: 16,
        efConstruction: 100,
        m: 16,
        dynamicEfMin: 100,
        dynamicEfMax: 500,
        dynamicEfFactor: 8,
        skip: false,
        vectorCacheMaxObjects: 100000,
      },
    },
    VECTOR_PROJECT: {
      class: 'VectorProject',
      description: 'A vectorized project with its metadata',
      vectorizer: 'text2vec-contextionary',
      properties: [
        { name: 'id', dataType: ['text'] },
        { name: 'name', dataType: ['text'] },
        { name: 'description', dataType: ['text'] },
        { name: 'createdAt', dataType: ['date'] },
        { name: 'updatedAt', dataType: ['date'] },
        { name: 'metadata', dataType: ['object'] },
      ],
      vectorIndexConfig: {
        distance: 'cosine',
        ef: 100,
        maxConnections: 16,
        efConstruction: 100,
        m: 16,
        dynamicEfMin: 100,
        dynamicEfMax: 500,
        dynamicEfFactor: 8,
        skip: false,
        vectorCacheMaxObjects: 100000,
      },
    },
  },
}; 