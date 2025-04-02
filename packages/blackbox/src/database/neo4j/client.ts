/**
 * Neo4j Client Implementation
 * 
 * This module provides the Neo4j client implementation for semantic memory operations,
 * including knowledge graph management, concept relationships, and semantic search.
 */

import neo4j, { Driver, Session, Result } from 'neo4j-driver';
import { Neo4jConfig, Neo4jSchema } from './config';
import { StandardizedChunk } from '../../shared/types/standardized-chunk';

export class SemanticMemoryClient {
  private driver: Driver;

  constructor(config: Neo4jConfig) {
    this.driver = neo4j.driver(
      config.uri,
      neo4j.auth.basic(config.user, config.password),
      {
        maxConnectionPoolSize: config.maxConnectionPoolSize,
        connectionTimeout: config.connectionTimeout,
        maxTransactionRetryTime: config.maxTransactionRetryTime,
      }
    );
  }

  /**
   * Initialize the database schema by creating indexes and constraints
   */
  async initialize(): Promise<void> {
    const session = this.driver.session();
    try {
      // Drop existing constraints and indexes
      await session.run('DROP CONSTRAINT knowledge_id IF EXISTS');
      await session.run('DROP CONSTRAINT knowledge_id_unique IF EXISTS');
      await session.run('DROP INDEX knowledge_id IF EXISTS');
      
      // Create unique constraint on id
      await session.run(`
        CREATE CONSTRAINT knowledge_id_unique IF NOT EXISTS
        FOR (k:Knowledge) REQUIRE k.id IS UNIQUE
      `);

      // Test connection with a simple query
      await session.run('RETURN 1 as test');
    } finally {
      await session.close();
    }
  }

  /**
   * Store a knowledge node in the semantic memory
   */
  async storeKnowledge(chunk: StandardizedChunk): Promise<void> {
    const session = this.driver.session();
    try {
      await session.writeTransaction(async (tx) => {
        // Create or update knowledge node
        const createKnowledgeQuery = `
          MERGE (k:Knowledge {id: $id})
          SET k.content = $content,
              k.contentType = $contentType,
              k.projectId = $projectId,
              k.connectorId = $connectorId,
              k.createdAt = datetime(),
              k.updatedAt = datetime(),
              k.processedAt = datetime($processedAt)
              ${chunk.rawMetadata ? ', k.metadata = $metadata' : ''}
        `;

        await tx.run(createKnowledgeQuery, {
          id: chunk.id,
          content: chunk.content,
          contentType: chunk.contentType,
          projectId: chunk.projectId,
          connectorId: chunk.connectorId,
          processedAt: chunk.processedAt,
          ...(chunk.rawMetadata ? { metadata: chunk.rawMetadata } : {}),
        });

        // Create or update source node and connect to knowledge
        if (chunk.source) {
          const createSourceQuery = `
            MERGE (s:Source {id: $sourceId})
            SET s.type = $sourceType
            ${chunk.source.url ? ', s.url = $sourceUrl' : ''}
            ${chunk.source.container ? ', s.container = $sourceContainer' : ''}
            ${chunk.source.title ? ', s.title = $sourceTitle' : ''}
            WITH s
            MATCH (k:Knowledge {id: $id})
            MERGE (k)-[r:REFERENCES]->(s)
          `;

          await tx.run(createSourceQuery, {
            sourceId: chunk.source.id,
            sourceType: chunk.source.type,
            ...(chunk.source.url ? { sourceUrl: chunk.source.url } : {}),
            ...(chunk.source.container ? { sourceContainer: chunk.source.container } : {}),
            ...(chunk.source.title ? { sourceTitle: chunk.source.title } : {}),
            id: chunk.id,
          });
        }

        // Create or update project node and connect to knowledge
        const createProjectQuery = `
          MERGE (p:Project {id: $projectId})
          SET p.updatedAt = datetime()
          WITH p
          MATCH (k:Knowledge {id: $id})
          MERGE (k)-[r:BELONGS_TO]->(p)
        `;

        await tx.run(createProjectQuery, {
          projectId: chunk.projectId,
          id: chunk.id,
        });
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Retrieve a knowledge node by ID
   */
  async getKnowledge(id: string): Promise<StandardizedChunk | null> {
    const session = this.driver.session();
    try {
      const result = await session.readTransaction(async (tx) => {
        const query = `
          MATCH (k:Knowledge {id: $id})
          OPTIONAL MATCH (k)-[r:REFERENCES]->(s:Source)
          OPTIONAL MATCH (k)-[b:BELONGS_TO]->(p:Project)
          RETURN k, s, p
        `;

        return await tx.run(query, { id });
      });

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      const knowledge = record.get('k').properties;
      const source = record.get('s')?.properties;
      const project = record.get('p')?.properties;

      const chunk: StandardizedChunk = {
        id: knowledge.id,
        connectorId: knowledge.connectorId,
        content: knowledge.content,
        contentType: knowledge.contentType,
        projectId: knowledge.projectId,
        processedAt: knowledge.processedAt,
        rawMetadata: knowledge.metadata,
        source: source ? {
          id: source.id,
          type: source.type,
          url: source.url,
          container: source.container,
          title: source.title,
        } : {
          id: 'unknown',
          type: 'unknown',
        },
      };

      return chunk;
    } finally {
      await session.close();
    }
  }

  /**
   * Create a relationship between two knowledge nodes
   */
  async createRelationship(
    sourceId: string,
    targetId: string,
    type: string,
    properties: Record<string, any> = {}
  ): Promise<void> {
    const session = this.driver.session();
    try {
      await session.writeTransaction(async (tx) => {
        const query = `
          MATCH (source:Knowledge {id: $sourceId})
          MATCH (target:Knowledge {id: $targetId})
          MERGE (source)-[r:${type}]->(target)
          SET r += $properties
        `;

        await tx.run(query, {
          sourceId,
          targetId,
          properties: {
            ...properties,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Find similar knowledge nodes based on content and metadata
   */
  async findSimilar(
    projectId: string,
    content: string,
    contentType: string,
    limit: number = 10
  ): Promise<StandardizedChunk[]> {
    const session = this.driver.session();
    try {
      const result = await session.readTransaction(async (tx) => {
        const query = `
          MATCH (k:Knowledge)
          WHERE k.projectId = $projectId
          AND k.contentType = $contentType
          AND k.content CONTAINS $content
          RETURN k
          ORDER BY k.processedAt DESC
          LIMIT $limit
        `;

        return await tx.run(query, {
          projectId,
          contentType,
          content,
          limit,
        });
      });

      return result.records.map((record) => {
        const knowledge = record.get('k').properties;
        const chunk: StandardizedChunk = {
          id: knowledge.id,
          connectorId: knowledge.connectorId,
          content: knowledge.content,
          contentType: knowledge.contentType,
          projectId: knowledge.projectId,
          processedAt: knowledge.processedAt,
          rawMetadata: knowledge.metadata,
          source: {
            id: 'unknown',
            type: 'unknown',
          },
        };
        return chunk;
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Get related knowledge nodes for a given node
   */
  async getRelated(
    id: string,
    relationshipTypes: string[] = [],
    limit: number = 10
  ): Promise<StandardizedChunk[]> {
    const session = this.driver.session();
    try {
      const types = relationshipTypes.length > 0
        ? relationshipTypes.map(type => `:${type}`).join('|')
        : '';

      const result = await session.readTransaction(async (tx) => {
        const query = `
          MATCH (k:Knowledge {id: $id})-[r${types}]->(related:Knowledge)
          RETURN related
          ORDER BY r.createdAt DESC
          LIMIT $limit
        `;

        return await tx.run(query, { id, limit });
      });

      return result.records.map((record) => {
        const knowledge = record.get('related').properties;
        const chunk: StandardizedChunk = {
          id: knowledge.id,
          connectorId: knowledge.connectorId,
          content: knowledge.content,
          contentType: knowledge.contentType,
          projectId: knowledge.projectId,
          processedAt: knowledge.processedAt,
          rawMetadata: knowledge.metadata,
          source: {
            id: 'unknown',
            type: 'unknown',
          },
        };
        return chunk;
      });
    } finally {
      await session.close();
    }
  }

  /**
   * Close the Neo4j driver connection
   */
  async close(): Promise<void> {
    await this.driver.close();
  }

  async cleanup(): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run('MATCH (n) DETACH DELETE n');
    } finally {
      await session.close();
    }
    await this.close();
  }
} 