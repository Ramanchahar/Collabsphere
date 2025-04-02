/**
 * MongoDB Client Implementation
 * 
 * This module provides the MongoDB client implementation for long-term memory operations,
 * including storing and retrieving chunks, concepts, and relationships.
 */

import { MongoClient, Collection, Db, ObjectId } from 'mongodb';
import { MongoDBConfigSchema } from './config';
import { StandardizedChunk } from '../../shared/types/standardized-chunk';

interface MongoCollections {
  chunks: Collection;
  concepts: Collection;
  sources: Collection;
  projects: Collection;
  relationships: Collection;
}

export class LongTermMemoryClient {
  private client: MongoClient;
  private db: Db;
  private collections: MongoCollections;

  constructor(config: typeof MongoDBConfigSchema._type) {
    this.client = new MongoClient(config.uri, {
      ...config.options,
      auth: {
        username: 'test_user',
        password: 'test_password',
      },
    });
    this.db = this.client.db(config.database);
    this.collections = {
      chunks: this.db.collection('chunks'),
      concepts: this.db.collection('concepts'),
      sources: this.db.collection('sources'),
      projects: this.db.collection('projects'),
      relationships: this.db.collection('relationships'),
    };
  }

  /**
   * Initialize the database by creating indexes
   */
  async initialize(): Promise<void> {
    // Create indexes
    await this.collections.chunks.createIndex({ id: 1 }, { unique: true });
    await this.collections.concepts.createIndex({ id: 1 }, { unique: true });
    await this.collections.sources.createIndex({ id: 1 }, { unique: true });
    await this.collections.projects.createIndex({ id: 1 }, { unique: true });
    await this.collections.relationships.createIndex({ id: 1 }, { unique: true });
  }

  /**
   * Store a chunk in long-term memory
   */
  async storeChunk(chunk: StandardizedChunk, vectorId: string): Promise<void> {
    await this.collections.chunks.insertOne({
      id: chunk.id,
      content: chunk.content,
      contentType: chunk.contentType,
      projectId: chunk.projectId,
      connectorId: chunk.connectorId,
      processedAt: chunk.processedAt,
      source: chunk.source,
      vectorId,
    });
  }

  /**
   * Retrieve a chunk from long-term memory
   */
  async getChunk(id: string): Promise<StandardizedChunk | null> {
    const result = await this.collections.chunks.findOne({ id });
    if (!result) return null;

    return {
      id: result.id,
      content: result.content,
      contentType: result.contentType,
      projectId: result.projectId,
      connectorId: result.connectorId,
      processedAt: result.processedAt,
      source: result.source,
    };
  }

  /**
   * Update a chunk's metadata in long-term memory
   */
  async updateChunkMetadata(id: string, metadata: Record<string, any>): Promise<void> {
    await this.collections.chunks.updateOne(
      { id },
      { $set: metadata }
    );
  }

  /**
   * Store a concept in long-term memory
   */
  async storeConcept(concept: StandardizedChunk): Promise<void> {
    await this.collections.concepts.insertOne({
      id: concept.id,
      content: concept.content,
      contentType: concept.contentType,
      projectId: concept.projectId,
      connectorId: concept.connectorId,
      processedAt: concept.processedAt,
      source: concept.source,
    });
  }

  /**
   * Store a relationship between nodes in long-term memory
   */
  async storeRelationship(sourceNodeId: string, targetNodeId: string, type: string): Promise<void> {
    await this.collections.relationships.insertOne({
      id: `${sourceNodeId}-${targetNodeId}`,
      sourceNodeId,
      targetNodeId,
      type,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Get all relationships for a node
   */
  async getNodeRelationships(nodeId: string): Promise<Array<{ sourceNodeId: string; targetNodeId: string; type: string }>> {
    const relationships = await this.collections.relationships
      .find({
        $or: [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }],
      })
      .toArray();

    return relationships.map(rel => ({
      sourceNodeId: rel.sourceNodeId,
      targetNodeId: rel.targetNodeId,
      type: rel.type,
    }));
  }

  /**
   * Close the MongoDB connection
   */
  async close(): Promise<void> {
    await this.client.close();
  }

  async cleanup(): Promise<void> {
    await this.collections.chunks.deleteMany({});
    await this.collections.concepts.deleteMany({});
    await this.collections.relationships.deleteMany({});
    await this.close();
  }
} 