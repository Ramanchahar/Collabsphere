/**
 * PostgreSQL Configuration for Working Memory
 * 
 * This module handles PostgreSQL connection configuration for the working memory layer.
 * Working memory holds a limited amount of information in an active, readily available state.
 */

import { Pool, PoolConfig } from 'pg';
import { z } from 'zod';

// PostgreSQL configuration schema
export const PostgresConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(5432),
  database: z.string(),
  user: z.string(),
  password: z.string(),
  max: z.number().default(20), // Maximum number of clients in the pool
  idleTimeoutMillis: z.number().default(30000), // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: z.number().default(2000), // How long to wait for a connection
  ssl: z.boolean().default(false),
});

export type PostgresConfig = z.infer<typeof PostgresConfigSchema>;

// Default configuration
export const defaultPostgresConfig: PostgresConfig = {
  host: 'localhost',
  port: 5432,
  database: 'collabsphere_working_memory',
  user: 'postgres',
  password: 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false,
};

/**
 * Creates a PostgreSQL pool instance with the provided configuration
 */
export function createPostgresPool(config: PostgresConfig = defaultPostgresConfig): Pool {
  const validatedConfig = PostgresConfigSchema.parse(config);
  return new Pool(validatedConfig);
}

/**
 * SQL table names and schemas
 */
export const WorkingMemoryTables = {
  chunks: 'working_memory_chunks',
  processing_status: 'processing_status',
  batch_tracking: 'batch_tracking',
  confidence_scores: 'confidence_scores',
} as const;

/**
 * SQL schema definitions
 */
export const WorkingMemorySchema = {
  chunks: `
    CREATE TABLE IF NOT EXISTS ${WorkingMemoryTables.chunks} (
      id TEXT PRIMARY KEY,
      connector_id TEXT NOT NULL,
      content TEXT NOT NULL,
      content_type TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_id TEXT NOT NULL,
      source_url TEXT,
      source_container TEXT,
      source_title TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL,
      modified_at TIMESTAMP WITH TIME ZONE NOT NULL,
      processed_at TIMESTAMP WITH TIME ZONE NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_email TEXT,
      project_id TEXT NOT NULL,
      topics TEXT[],
      tags TEXT[],
      language TEXT,
      document_id TEXT,
      path TEXT[],
      previous_chunk_id TEXT,
      next_chunk_id TEXT,
      chunk_order INTEGER,
      relationships JSONB,
      metadata JSONB,
      embedding VECTOR(1536),
      created_at_idx TIMESTAMP WITH TIME ZONE,
      modified_at_idx TIMESTAMP WITH TIME ZONE,
      processed_at_idx TIMESTAMP WITH TIME ZONE
    )
  `,
  
  processing_status: `
    CREATE TABLE IF NOT EXISTS ${WorkingMemoryTables.processing_status} (
      chunk_id TEXT PRIMARY KEY REFERENCES ${WorkingMemoryTables.chunks}(id),
      status TEXT NOT NULL,
      error TEXT,
      retry_count INTEGER DEFAULT 0,
      last_attempt TIMESTAMP WITH TIME ZONE,
      next_attempt TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  batch_tracking: `
    CREATE TABLE IF NOT EXISTS ${WorkingMemoryTables.batch_tracking} (
      batch_id TEXT PRIMARY KEY,
      connector_id TEXT NOT NULL,
      source_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      total_chunks INTEGER NOT NULL,
      processed_chunks INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      error TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  confidence_scores: `
    CREATE TABLE IF NOT EXISTS ${WorkingMemoryTables.confidence_scores} (
      chunk_id TEXT PRIMARY KEY REFERENCES ${WorkingMemoryTables.chunks}(id),
      confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
      doubt_score INTEGER NOT NULL CHECK (doubt_score >= 0 AND doubt_score <= 100),
      quality_score INTEGER NOT NULL CHECK (quality_score >= 0 AND quality_score <= 100),
      credibility_score INTEGER NOT NULL CHECK (credibility_score >= 0 AND credibility_score <= 100),
      usage_score INTEGER NOT NULL CHECK (usage_score >= 0 AND usage_score <= 100),
      technical_score INTEGER NOT NULL CHECK (technical_score >= 0 AND technical_score <= 100),
      deprecation_score INTEGER NOT NULL CHECK (deprecation_score >= 0 AND deprecation_score <= 100),
      incompleteness_score INTEGER NOT NULL CHECK (incompleteness_score >= 0 AND incompleteness_score <= 100),
      contradiction_score INTEGER NOT NULL CHECK (contradiction_score >= 0 AND contradiction_score <= 100),
      obsolescence_score INTEGER NOT NULL CHECK (obsolescence_score >= 0 AND obsolescence_score <= 100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `,
} as const;

/**
 * Index definitions
 */
export const WorkingMemoryIndexes = {
  chunks: [
    `CREATE INDEX IF NOT EXISTS idx_chunks_created_at ON ${WorkingMemoryTables.chunks}(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_modified_at ON ${WorkingMemoryTables.chunks}(modified_at)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_processed_at ON ${WorkingMemoryTables.chunks}(processed_at)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_project_id ON ${WorkingMemoryTables.chunks}(project_id)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_connector_id ON ${WorkingMemoryTables.chunks}(connector_id)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_source_id ON ${WorkingMemoryTables.chunks}(source_id)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_author_id ON ${WorkingMemoryTables.chunks}(author_id)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_topics ON ${WorkingMemoryTables.chunks} USING GIN(topics)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_tags ON ${WorkingMemoryTables.chunks} USING GIN(tags)`,
    `CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON ${WorkingMemoryTables.chunks} USING ivfflat (embedding vector_cosine_ops)`,
  ],
  
  processing_status: [
    `CREATE INDEX IF NOT EXISTS idx_processing_status_status ON ${WorkingMemoryTables.processing_status}(status)`,
    `CREATE INDEX IF NOT EXISTS idx_processing_status_next_attempt ON ${WorkingMemoryTables.processing_status}(next_attempt)`,
  ],
  
  batch_tracking: [
    `CREATE INDEX IF NOT EXISTS idx_batch_tracking_status ON ${WorkingMemoryTables.batch_tracking}(status)`,
    `CREATE INDEX IF NOT EXISTS idx_batch_tracking_project_id ON ${WorkingMemoryTables.batch_tracking}(project_id)`,
    `CREATE INDEX IF NOT EXISTS idx_batch_tracking_connector_id ON ${WorkingMemoryTables.batch_tracking}(connector_id)`,
  ],
} as const; 