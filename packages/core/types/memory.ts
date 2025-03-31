/**
 * Core memory types for CollabSphere AI
 * 
 * This file defines the fundamental data structures for the
 * 5-level memory system implemented by Raman.
 */

/**
 * Memory levels in the system, inspired by human cognition
 */
export type MemoryLevel = 'sensory' | 'working' | 'semantic' | 'episodic' | 'procedural';

/**
 * Confidence and doubt scores (0-100)
 */
export interface ConfidenceScores {
  confidence: number;           // 0-100
  doubt: number;                // 0-100
  confidenceComponents?: {      // Optional breakdown of confidence
    informationQuality?: number; // Completeness, clarity, examples
    sourceCredibility?: number; // Official vs third-party, reputation
    usageEvidence?: number;     // Adoption metrics, examples
    technicalAccuracy?: number; // Correctness, feasibility
  };
  doubtComponents?: {           // Optional breakdown of doubt
    deprecationSignals?: number; // Warnings, replacements, EOL
    incompletenessIndicators?: number; // Missing info, gaps
    contradictionDetection?: number; // Conflicting approaches
    obsolescenceRisk?: number;  // Age, compatibility concerns
  };
}

/**
 * Base knowledge node interface
 */
export interface KnowledgeNode {
  id: string;
  content: string;
  contentType: string;
  projectId: string;
  embedding?: number[];         // Vector representation
  metadata: {
    source: {
      type: string;
      url: string;
      id: string;
      lastModified: string;
    };
    created: string;
    modified: string;
    properties: Record<string, any>;
  };
  scores: ConfidenceScores;
  memoryLevel: MemoryLevel;
  lastAccessed?: string;        // ISO timestamp
  accessCount?: number;         // Number of times retrieved
}

/**
 * Relationship between knowledge nodes
 */
export interface Relationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: string;
  strength: number;             // 0-1
  scores: ConfidenceScores;     // Confidence in this relationship
  created: string;              // ISO timestamp
  modified: string;             // ISO timestamp
}

/**
 * Sensory memory node (initial intake)
 */
export interface SensoryNode extends KnowledgeNode {
  memoryLevel: 'sensory';
  expiresAt: string;            // ISO timestamp for auto-expiration
}

/**
 * Working memory node (active processing)
 */
export interface WorkingNode extends KnowledgeNode {
  memoryLevel: 'working';
  activeUntil: string;          // ISO timestamp for retention
  processingState: 'analyzing' | 'connecting' | 'scoring' | 'ready';
}

/**
 * Semantic memory node (concepts and facts)
 */
export interface SemanticNode extends KnowledgeNode {
  memoryLevel: 'semantic';
  conceptLevel: number;         // Abstraction level (0-5)
  importance: number;           // Importance score (0-100)
}

/**
 * Episodic memory node (context and history)
 */
export interface EpisodicNode extends KnowledgeNode {
  memoryLevel: 'episodic';
  timestamp: string;            // When this episode occurred
  context: Record<string, any>; // Context information
  actors: string[];             // Who was involved
}

/**
 * Procedural memory node (processes and workflows)
 */
export interface ProceduralNode extends KnowledgeNode {
  memoryLevel: 'procedural';
  steps: Array<{               // Process steps
    description: string;
    nodeIds: string[];         // Related knowledge nodes
  }>;
  efficiency: number;          // How efficient is this process (0-100)
} 