/**
 * Weaviate Client Implementation
 * 
 * This module provides the Weaviate client implementation for vector storage operations,
 * including storing and retrieving vectorized chunks, concepts, and semantic search.
 */

import { WeaviateClient } from 'weaviate-ts-client';
import { WeaviateConfigSchema, createWeaviateClient } from './config';
import { StandardizedChunk } from '../../shared/types/standardized-chunk';

export class VectorStorageClient {
  private client: WeaviateClient;

  constructor(config: typeof WeaviateConfigSchema._type) {
    this.client = createWeaviateClient(config);
  }

  /**
   * Initialize the database schema by creating classes
   */
  async initialize(): Promise<void> {
    try {
      // Create schema for vectorized chunks
      await this.client.schema
        .classCreator()
        .withClass({
          class: 'VectorizedChunk',
          description: 'A vectorized chunk of content',
          properties: [
            {
              name: 'chunkId',
              dataType: ['text'],
            },
            {
              name: 'content',
              dataType: ['text'],
            },
            {
              name: 'contentType',
              dataType: ['text'],
            },
            {
              name: 'projectId',
              dataType: ['text'],
            },
            {
              name: 'connectorId',
              dataType: ['text'],
            },
            {
              name: 'processedAt',
              dataType: ['date'],
            },
            {
              name: 'sourceId',
              dataType: ['text'],
            },
            {
              name: 'sourceType',
              dataType: ['text'],
            },
            {
              name: 'sourceUrl',
              dataType: ['text'],
            },
            {
              name: 'sourceContainer',
              dataType: ['text'],
            },
            {
              name: 'sourceTitle',
              dataType: ['text'],
            },
          ],
          vectorizer: 'none',
        })
        .do();
    } catch (error) {
      // Ignore error if class already exists
      if (!(error as Error).message.includes('already exists')) {
        throw error;
      }
    }
  }

  /**
   * Store a vectorized chunk in the vector storage
   */
  async storeVectorChunk(chunk: StandardizedChunk, vector: number[]): Promise<void> {
    await this.client.data
      .creator()
      .withClassName('VectorizedChunk')
      .withProperties({
        chunkId: chunk.id,
        content: chunk.content,
        contentType: chunk.contentType,
        projectId: chunk.projectId,
        connectorId: chunk.connectorId,
        processedAt: chunk.processedAt,
        sourceId: chunk.source?.id,
        sourceType: chunk.source?.type,
        sourceUrl: chunk.source?.url,
        sourceContainer: chunk.source?.container,
        sourceTitle: chunk.source?.title,
      })
      .withVector(vector)
      .do();
  }

  /**
   * Retrieve a vectorized chunk by ID
   */
  async getVectorChunk(id: string): Promise<StandardizedChunk | null> {
    const result = await this.client.graphql
      .get()
      .withClassName('VectorizedChunk')
      .withWhere({
        path: ['chunkId'],
        operator: 'Equal',
        valueString: id,
      })
      .withFields('chunkId content contentType projectId connectorId processedAt sourceId sourceType sourceUrl sourceContainer sourceTitle')
      .do();

    if (!result.data.Get.VectorizedChunk || result.data.Get.VectorizedChunk.length === 0) {
      return null;
    }

    const chunk = result.data.Get.VectorizedChunk[0];
    return {
      id: chunk.chunkId,
      content: chunk.content,
      contentType: chunk.contentType,
      projectId: chunk.projectId,
      connectorId: chunk.connectorId,
      processedAt: chunk.processedAt,
      source: chunk.sourceId ? {
        id: chunk.sourceId,
        type: chunk.sourceType,
        url: chunk.sourceUrl,
        container: chunk.sourceContainer,
        title: chunk.sourceTitle,
      } : {
        id: 'unknown',
        type: 'unknown',
      },
    };
  }

  /**
   * Find similar vectorized chunks based on a query vector
   */
  async findSimilarChunks(vector: number[], limit: number = 5): Promise<StandardizedChunk[]> {
    const result = await this.client.graphql
      .get()
      .withClassName('VectorizedChunk')
      .withNearVector({
        vector,
        certainty: 0.7,
      })
      .withLimit(limit)
      .withFields('chunkId content contentType projectId connectorId processedAt sourceId sourceType sourceUrl sourceContainer sourceTitle')
      .do();

    return result.data.Get.VectorizedChunk.map((chunk: any) => ({
      id: chunk.chunkId,
      content: chunk.content,
      contentType: chunk.contentType,
      projectId: chunk.projectId,
      connectorId: chunk.connectorId,
      processedAt: chunk.processedAt,
      source: chunk.sourceId ? {
        id: chunk.sourceId,
        type: chunk.sourceType,
        url: chunk.sourceUrl,
        container: chunk.sourceContainer,
        title: chunk.sourceTitle,
      } : {
        id: 'unknown',
        type: 'unknown',
      },
    }));
  }

  /**
   * Delete a vectorized chunk by ID
   */
  async deleteChunk(id: string): Promise<void> {
    const result = await this.client.graphql
      .get()
      .withClassName('VectorizedChunk')
      .withWhere({
        path: ['chunkId'],
        operator: 'Equal',
        valueString: id,
      })
      .withFields('_additional { id }')
      .do();

    if (result.data.Get.VectorizedChunk && result.data.Get.VectorizedChunk.length > 0) {
      const objectId = result.data.Get.VectorizedChunk[0]._additional.id;
      await this.client.data
        .deleter()
        .withId(objectId)
        .withClassName('VectorizedChunk')
        .do();
    }
  }

  /**
   * Update a vectorized chunk's vector
   */
  async updateChunkVector(id: string, vector: number[]): Promise<void> {
    const result = await this.client.graphql
      .get()
      .withClassName('VectorizedChunk')
      .withWhere({
        path: ['chunkId'],
        operator: 'Equal',
        valueString: id,
      })
      .withFields('_additional { id } chunkId content contentType projectId connectorId processedAt sourceId sourceType sourceUrl sourceContainer sourceTitle')
      .do();

    if (result.data.Get.VectorizedChunk && result.data.Get.VectorizedChunk.length > 0) {
      const chunk = result.data.Get.VectorizedChunk[0];
      const objectId = chunk._additional.id;
      
      // Delete the old object
      await this.client.data
        .deleter()
        .withId(objectId)
        .withClassName('VectorizedChunk')
        .do();

      // Create a new object with the updated vector
      await this.client.data
        .creator()
        .withClassName('VectorizedChunk')
        .withProperties({
          chunkId: chunk.chunkId,
          content: chunk.content,
          contentType: chunk.contentType,
          projectId: chunk.projectId,
          connectorId: chunk.connectorId,
          processedAt: chunk.processedAt,
          sourceId: chunk.sourceId,
          sourceType: chunk.sourceType,
          sourceUrl: chunk.sourceUrl,
          sourceContainer: chunk.sourceContainer,
          sourceTitle: chunk.sourceTitle,
        })
        .withVector(vector)
        .do();
    }
  }

  /**
   * Get the vector for a chunk by ID
   */
  async getVector(id: string): Promise<number[] | null> {
    const result = await this.client.graphql
      .get()
      .withClassName('VectorizedChunk')
      .withWhere({
        path: ['chunkId'],
        operator: 'Equal',
        valueString: id,
      })
      .withFields('_additional { vector }')
      .do();

    if (!result.data.Get.VectorizedChunk || result.data.Get.VectorizedChunk.length === 0) {
      return null;
    }

    return result.data.Get.VectorizedChunk[0]._additional.vector;
  }

  async close(): Promise<void> {
    // Weaviate client doesn't have a close method
  }

  async cleanup(): Promise<void> {
    try {
      await this.client.schema.deleteAll();
    } catch (error) {
      console.error('Error cleaning up Weaviate:', error);
    }
  }
} 