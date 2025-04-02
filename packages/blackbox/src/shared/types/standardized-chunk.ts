/**
 * CollabSphere AI Standardized Chunk Format
 * 
 * The data transfer format between Intake Layer and Black Box.
 * This format provides raw information needed by the Black Box
 * without performing any of the Black Box's processing work.
 */

import { z } from 'zod';

/**
 * Content type classification (basic categorization only)
 */
export enum ContentType {
  TEXT = 'text',
  CODE = 'code',
  TABLE = 'table',
  LIST = 'list',
  HEADING = 'heading',
  IMAGE = 'image',
  DIAGRAM = 'diagram',
  FILE = 'file',
  OTHER = 'other'
}

/**
 * The core standardized chunk interface
 */
export interface StandardizedChunk {
  // Essential identification
  id: string;                      // Unique identifier for this chunk
  connectorId: string;             // Identifier for the source connector
  
  // Core content
  content: string;                 // The actual content
  contentType: ContentType;        // Type classification
  contentFormat?: string;          // Format details (e.g., language for code)
  
  // Basic metadata (raw, unprocessed)
  source: {
    type: string;                  // Source system (e.g., "notion", "github")
    id: string;                    // Original ID in source system
    url?: string;                  // URL to original content if available
    container?: string;            // Parent container in source
    title?: string;                // Original title if available
  };
  
  // Temporal information (raw, from source)
  created?: string;                // ISO timestamp of creation
  modified?: string;               // ISO timestamp of last modification
  processedAt: string;             // ISO timestamp of intake processing
  
  // Author information (raw, from source)
  author?: {
    id?: string;                   // Author ID if available
    name?: string;                 // Author name if available
    email?: string;                // Author email if available
  };
  
  // Project association (if explicitly known)
  projectId?: string;              // Associated project if known
  
  // Context and classification (raw from source)
  context?: {
    topics?: string[];             // Key topics from source
    tags?: string[];               // Tags from source
    language?: string;             // Content language (ISO code)
  };
  
  // Position information (structural only)
  position?: {
    documentId?: string;           // ID of parent document
    path?: string[];               // Path in document hierarchy
    previousChunkId?: string;      // ID of preceding chunk
    nextChunkId?: string;          // ID of following chunk
    order?: number;                // Sequence order if applicable
  };
  
  // Explicit relationships (only those explicitly defined in source)
  relationships?: Array<{
    targetId: string;              // ID of target in source system
    targetChunkId?: string;        // ID of target chunk if processed
    type: string;                  // Type of relationship as defined in source
  }>;
  
  // Original raw metadata (preserved for Black Box processing)
  rawMetadata?: Record<string, any>;
}

/**
 * Interface for batching related chunks
 */
export interface ChunkBatch {
  batchId: string;                 // Unique batch identifier
  connectorId: string;             // Connector that produced this batch
  sourceId: string;                // Source identifier
  projectId?: string;              // Associated project
  chunks: StandardizedChunk[];     // The actual chunks
  batchMetadata?: {
    totalChunks: number;           // Total chunks from this source
    batchNumber: number;           // Sequence number of this batch
    isComplete: boolean;           // Whether processing is complete
  };
}

// Zod schemas for validation
export const StandardizedChunkSchema = z.object({
  id: z.string(),
  connectorId: z.string(),
  content: z.string(),
  contentType: z.nativeEnum(ContentType),
  contentFormat: z.string().optional(),
  source: z.object({
    type: z.string(),
    id: z.string(),
    url: z.string().url().optional(),
    container: z.string().optional(),
    title: z.string().optional(),
  }),
  created: z.string().datetime().optional(),
  modified: z.string().datetime().optional(),
  processedAt: z.string().datetime(),
  author: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
  projectId: z.string().optional(),
  context: z.object({
    topics: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    language: z.string().optional(),
  }).optional(),
  position: z.object({
    documentId: z.string().optional(),
    path: z.array(z.string()).optional(),
    previousChunkId: z.string().optional(),
    nextChunkId: z.string().optional(),
    order: z.number().optional(),
  }).optional(),
  relationships: z.array(z.object({
    targetId: z.string(),
    targetChunkId: z.string().optional(),
    type: z.string(),
  })).optional(),
  rawMetadata: z.record(z.unknown()).optional(),
});

export const ChunkBatchSchema = z.object({
  batchId: z.string(),
  connectorId: z.string(),
  sourceId: z.string(),
  projectId: z.string().optional(),
  chunks: z.array(StandardizedChunkSchema),
  batchMetadata: z.object({
    totalChunks: z.number(),
    batchNumber: z.number(),
    isComplete: z.boolean(),
  }).optional(),
});

// Type exports
export type StandardizedChunkType = z.infer<typeof StandardizedChunkSchema>;
export type ChunkBatchType = z.infer<typeof ChunkBatchSchema>; 