/**
 * Core API types for CollabSphere AI
 * 
 * This file defines the interfaces for API communication between
 * the Black Box memory system (Raman) and the Frontend (Himalaya).
 */

import { KnowledgeNode, Relationship, ConfidenceScores, MemoryLevel } from './memory';

/**
 * Query request from the frontend
 */
export interface QueryRequest {
  query: string;
  projectId: string;
  filters?: {
    confidenceThreshold?: number;    // Minimum confidence score
    memoryLevels?: MemoryLevel[];    // Specific memory levels to search
    contentTypes?: string[];         // Specific content types to search
    sources?: string[];              // Specific sources to search
    dateRange?: {                    // Date range to search
      start?: string;                // ISO timestamp
      end?: string;                  // ISO timestamp
    };
  };
  visualizationOptions?: {
    includeGraph?: boolean;          // Include graph data in response
    maxNodes?: number;               // Maximum nodes to return
    expandRelationships?: boolean;   // Include related nodes
  };
}

/**
 * Response to a query
 */
export interface QueryResponse {
  id: string;                       // Unique query ID
  projectId: string;                // Project context
  query: string;                    // Original query
  responseContent: string;          // Main response text
  overallConfidence: number;        // 0-100 confidence in response
  overallDoubt: number;             // 0-100 doubt in response
  explainedConfidence?: string;     // Explanation of confidence score
  sources: Array<{                  // Supporting sources
    nodeId: string;                 // Reference to knowledge node
    title: string;                  // Source title
    url?: string;                   // Source URL if available
    confidence: number;             // Confidence in this source
    relevance: number;              // Relevance to the query (0-100)
    snippet?: string;               // Text snippet from source
  }>;
  knowledgeGaps?: Array<{          // Identified knowledge gaps
    description: string;            // What's missing
    importance: number;             // How important (0-100)
  }>;
  relatedNodes?: KnowledgeNode[];   // Related knowledge nodes
  graph?: {                         // Knowledge graph for visualization
    nodes: KnowledgeNode[];
    relationships: Relationship[];
    metadata: {
      totalNodes: number;
      totalRelationships: number;
      confidenceDistribution: {
        high: number;               // Count of high confidence nodes
        medium: number;             // Count of medium confidence nodes
        low: number;                // Count of low confidence nodes
      };
    };
  };
  processingTime: number;           // Processing time in milliseconds
  timestamp: string;                // ISO timestamp
}

/**
 * Knowledge graph request
 */
export interface KnowledgeGraphRequest {
  projectId: string;
  centerNodeId?: string;            // Node to center graph on
  filters?: {
    confidenceThreshold?: number;   // Minimum confidence score
    memoryLevels?: MemoryLevel[];   // Specific memory levels
    contentTypes?: string[];        // Specific content types
    relationshipTypes?: string[];   // Specific relationship types
    maxDepth?: number;              // Maximum relationship depth
  };
  pagination?: {
    limit: number;                  // Max nodes to return
    offset: number;                 // Offset for pagination
  };
}

/**
 * Knowledge graph response
 */
export interface KnowledgeGraphResponse {
  projectId: string;
  nodes: KnowledgeNode[];           // Knowledge nodes
  relationships: Relationship[];    // Relationships between nodes
  metadata: {
    totalNodes: number;             // Total nodes in full graph
    totalRelationships: number;     // Total relationships in full graph
    centerNodeId?: string;          // Center node ID if specified
    confidenceDistribution: {
      high: number;                 // Count of high confidence nodes
      medium: number;               // Count of medium confidence nodes
      low: number;                  // Count of low confidence nodes
    };
    memoryLevelDistribution: Record<MemoryLevel, number>; // Nodes per level
  };
}

/**
 * Project information
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  created: string;                  // ISO timestamp
  modified: string;                 // ISO timestamp
  stats: {
    nodeCount: number;              // Total knowledge nodes
    relationshipCount: number;      // Total relationships
    connectorCount: number;         // Connected data sources
    lastQueryTime?: string;         // Last query timestamp
  };
  progress?: {                      // Project progress
    knowledgeCompletion: number;    // 0-100 knowledge completion
    knowledgeGaps: number;          // Count of identified gaps
    confidenceAverage: number;      // Average confidence score
  };
}

/**
 * WebSocket event types
 */
export type WebSocketEventType = 
  | 'knowledge_update'              // New/updated knowledge
  | 'query_progress'                // Query processing status
  | 'confidence_change'             // Confidence score changed
  | 'knowledge_gap'                 // New knowledge gap identified
  | 'connector_status';             // Connector status update

/**
 * WebSocket event message
 */
export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  projectId: string;
  timestamp: string;                // ISO timestamp
  data: T;
} 