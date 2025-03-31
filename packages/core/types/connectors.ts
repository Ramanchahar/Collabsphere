/**
 * Core connector types for CollabSphere AI
 * 
 * This file defines the interface between the Intake Layer (Taiwei)
 * and the Black Box memory system (Raman).
 */

/**
 * Standard format for all content chunks coming from connectors
 */
export interface StandardizedContent {
  id: string;
  content: string;
  contentType: 'text' | 'code' | 'image' | 'table' | 'list' | 'other';
  projectId: string;
  metadata: {
    source: {
      type: string;        // e.g., 'notion', 'github', etc.
      url: string;         // Source URL if available
      id: string;          // Internal ID in the source system
      lastModified: string; // ISO timestamp
    };
    created: string;       // ISO timestamp
    modified: string;      // ISO timestamp
    properties: Record<string, any>; // Source-specific properties
  };
  relationships?: Array<{
    targetId?: string;     // May be empty for initial ingestion
    type: string;          // Relationship type
    strength: number;      // 0-1, initial guess at relationship strength
  }>;
}

/**
 * Connector registration interface
 */
export interface ConnectorDefinition {
  id: string;              // Unique connector ID
  name: string;            // Display name
  description: string;     // Description
  version: string;         // Semantic version
  authType: 'oauth' | 'api_key' | 'basic' | 'none';
  capabilities: Array<'read' | 'write' | 'webhook' | 'realtime'>;
  configSchema: Record<string, any>; // JSON Schema for configuration
}

/**
 * Response from intake processing
 */
export interface IntakeResponse {
  success: boolean;
  contentId: string;
  status: 'processed' | 'queued' | 'failed';
  error?: string;
  processingStats?: {
    chunkCount: number;
    processingTimeMs: number;
  };
}

/**
 * Connector status information
 */
export interface ConnectorStatus {
  id: string;
  status: 'active' | 'error' | 'disabled';
  lastSync: string;        // ISO timestamp
  itemsProcessed: number;
  error?: string;
  nextScheduledSync?: string; // ISO timestamp
}

/**
 * Connector authentication configuration
 */
export interface ConnectorAuth {
  type: 'oauth' | 'api_key' | 'basic' | 'none';
  config: Record<string, any>; // Auth-specific configuration
  status: 'valid' | 'invalid' | 'expired' | 'pending';
  expiresAt?: string;      // ISO timestamp if relevant
} 