/**
 * PostgreSQL Client Implementation for Working Memory
 * 
 * This module implements the PostgreSQL client with methods for handling
 * working memory operations including chunk storage, processing status,
 * and confidence scoring.
 */

import { Pool, QueryResult } from 'pg';
import { StandardizedChunk, ChunkBatch } from '../../shared/types/standardized-chunk';
import { 
  createPostgresPool, 
  PostgresConfig,
  WorkingMemoryTables,
  WorkingMemorySchema,
  WorkingMemoryIndexes
} from './config';

export class WorkingMemoryClient {
  private pool: Pool;

  constructor(config?: PostgresConfig) {
    this.pool = createPostgresPool(config);
  }

  /**
   * Initialize the database schema and indexes
   */
  async initialize(): Promise<void> {
    const client = await this.pool.connect();
    try {
      // Create tables
      await client.query(WorkingMemorySchema.chunks);
      await client.query(WorkingMemorySchema.processing_status);
      await client.query(WorkingMemorySchema.batch_tracking);
      await client.query(WorkingMemorySchema.confidence_scores);

      // Create indexes
      for (const index of WorkingMemoryIndexes.chunks) {
        await client.query(index);
      }
      for (const index of WorkingMemoryIndexes.processing_status) {
        await client.query(index);
      }
      for (const index of WorkingMemoryIndexes.batch_tracking) {
        await client.query(index);
      }
    } finally {
      client.release();
    }
  }

  /**
   * Store a chunk in working memory
   */
  async storeChunk(chunk: StandardizedChunk): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert chunk
      const chunkQuery = `
        INSERT INTO ${WorkingMemoryTables.chunks} (
          id, connector_id, content, content_type, source_type, source_id,
          source_url, source_container, source_title, created_at, modified_at,
          processed_at, author_id, author_name, author_email, project_id,
          topics, tags, language, document_id, path, previous_chunk_id,
          next_chunk_id, chunk_order, relationships, raw_metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        ON CONFLICT (id) DO UPDATE SET
          content = EXCLUDED.content,
          modified_at = EXCLUDED.modified_at,
          processed_at = EXCLUDED.processed_at,
          raw_metadata = EXCLUDED.raw_metadata
      `;

      await client.query(chunkQuery, [
        chunk.id,
        chunk.connectorId,
        chunk.content,
        chunk.contentType,
        chunk.source.type,
        chunk.source.id,
        chunk.source.url,
        chunk.source.container,
        chunk.source.title,
        chunk.created,
        chunk.modified,
        chunk.processedAt,
        chunk.author?.id ?? null,
        chunk.author?.name ?? null,
        chunk.author?.email ?? null,
        chunk.projectId,
        chunk.context?.topics ?? null,
        chunk.context?.tags ?? null,
        chunk.context?.language ?? null,
        chunk.position?.documentId ?? null,
        chunk.position?.path ?? null,
        chunk.position?.previousChunkId ?? null,
        chunk.position?.nextChunkId ?? null,
        chunk.position?.order ?? null,
        chunk.relationships ? JSON.stringify(chunk.relationships) : null,
        chunk.rawMetadata ? JSON.stringify(chunk.rawMetadata) : null
      ]);

      // Initialize processing status
      const statusQuery = `
        INSERT INTO ${WorkingMemoryTables.processing_status} (chunk_id, status)
        VALUES ($1, 'pending')
        ON CONFLICT (chunk_id) DO NOTHING
      `;
      await client.query(statusQuery, [chunk.id]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a chunk from working memory
   */
  async getChunk(chunkId: string): Promise<StandardizedChunk | null> {
    const query = `
      SELECT * FROM ${WorkingMemoryTables.chunks}
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [chunkId]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      connectorId: row.connector_id,
      content: row.content,
      contentType: row.content_type,
      source: {
        type: row.source_type,
        id: row.source_id,
        url: row.source_url,
        container: row.source_container,
        title: row.source_title,
      },
      created: row.created_at,
      modified: row.modified_at,
      processedAt: row.processed_at,
      author: {
        id: row.author_id,
        name: row.author_name,
        email: row.author_email,
      },
      projectId: row.project_id,
      context: {
        topics: row.topics,
        tags: row.tags,
        language: row.language,
      },
      position: {
        documentId: row.document_id,
        path: row.path,
        previousChunkId: row.previous_chunk_id,
        nextChunkId: row.next_chunk_id,
        order: row.chunk_order,
      },
      relationships: row.relationships ? JSON.parse(row.relationships) : undefined,
      rawMetadata: row.raw_metadata ? JSON.parse(row.raw_metadata) : undefined,
    };
  }

  /**
   * Update chunk processing status
   */
  async updateProcessingStatus(
    chunkId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    error?: string,
    retryCount?: number
  ): Promise<void> {
    const query = `
      UPDATE ${WorkingMemoryTables.processing_status}
      SET 
        status = $1,
        error = $2,
        retry_count = COALESCE($3, retry_count),
        last_attempt = CURRENT_TIMESTAMP,
        next_attempt = CASE 
          WHEN $1 = 'failed' AND retry_count < 3 THEN CURRENT_TIMESTAMP + INTERVAL '5 minutes' * (retry_count + 1)
          ELSE NULL
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE chunk_id = $4
    `;
    
    await this.pool.query(query, [status, error, retryCount, chunkId]);
  }

  /**
   * Store confidence scores for a chunk
   */
  async storeConfidenceScores(chunkId: string, scores: {
    confidence: number;
    doubt: number;
    quality: number;
    credibility: number;
    usage: number;
    technical: number;
    deprecation: number;
    incompleteness: number;
    contradiction: number;
    obsolescence: number;
  }): Promise<void> {
    const query = `
      INSERT INTO ${WorkingMemoryTables.confidence_scores} (
        chunk_id, confidence_score, doubt_score, quality_score,
        credibility_score, usage_score, technical_score,
        deprecation_score, incompleteness_score, contradiction_score,
        obsolescence_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (chunk_id) DO UPDATE SET
        confidence_score = EXCLUDED.confidence_score,
        doubt_score = EXCLUDED.doubt_score,
        quality_score = EXCLUDED.quality_score,
        credibility_score = EXCLUDED.credibility_score,
        usage_score = EXCLUDED.usage_score,
        technical_score = EXCLUDED.technical_score,
        deprecation_score = EXCLUDED.deprecation_score,
        incompleteness_score = EXCLUDED.incompleteness_score,
        contradiction_score = EXCLUDED.contradiction_score,
        obsolescence_score = EXCLUDED.obsolescence_score,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    await this.pool.query(query, [
      chunkId,
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
    ]);
  }

  /**
   * Get chunks pending processing
   */
  async getPendingChunks(limit: number = 100): Promise<StandardizedChunk[]> {
    const query = `
      SELECT c.* FROM ${WorkingMemoryTables.chunks} c
      JOIN ${WorkingMemoryTables.processing_status} p ON c.id = p.chunk_id
      WHERE p.status = 'pending'
      AND (p.next_attempt IS NULL OR p.next_attempt <= CURRENT_TIMESTAMP)
      ORDER BY c.processed_at ASC
      LIMIT $1
    `;
    
    const result = await this.pool.query(query, [limit]);
    return result.rows.map(row => ({
      id: row.id,
      connectorId: row.connector_id,
      content: row.content,
      contentType: row.content_type,
      source: {
        type: row.source_type,
        id: row.source_id,
        url: row.source_url,
        container: row.source_container,
        title: row.source_title,
      },
      created: row.created_at,
      modified: row.modified_at,
      processedAt: row.processed_at,
      author: {
        id: row.author_id,
        name: row.author_name,
        email: row.author_email,
      },
      projectId: row.project_id,
      context: {
        topics: row.topics,
        tags: row.tags,
        language: row.language,
      },
      position: {
        documentId: row.document_id,
        path: row.path,
        previousChunkId: row.previous_chunk_id,
        nextChunkId: row.next_chunk_id,
        order: row.chunk_order,
      },
      relationships: row.relationships ? JSON.parse(row.relationships) : undefined,
      rawMetadata: row.raw_metadata ? JSON.parse(row.raw_metadata) : undefined,
    }));
  }

  /**
   * Update batch tracking status
   */
  async updateBatchStatus(
    batchId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    processedCount?: number,
    error?: string
  ): Promise<void> {
    const query = `
      UPDATE ${WorkingMemoryTables.batch_tracking}
      SET 
        status = $1,
        processed_chunks = COALESCE($2, processed_chunks),
        error = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE batch_id = $4
    `;
    
    await this.pool.query(query, [status, processedCount, error, batchId]);
  }

  /**
   * Close the PostgreSQL connection pool
   */
  async close(): Promise<void> {
    await this.pool.end();
  }

  async cleanup(): Promise<void> {
    await this.pool.query(`TRUNCATE TABLE ${WorkingMemoryTables.chunks} CASCADE`);
    await this.close();
  }
} 