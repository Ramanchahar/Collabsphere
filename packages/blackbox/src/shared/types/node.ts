import { z } from 'zod';

// Source information schema
export const SourceSchema = z.object({
  type: z.string(),
  url: z.string().url(),
  id: z.string(),
  lastModified: z.string().datetime(),
});

// Confidence scores schema
export const ConfidenceScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  informationQuality: z.number().min(0).max(100),
  sourceCredibility: z.number().min(0).max(100),
  usageEvidence: z.number().min(0).max(100),
  technicalAccuracy: z.number().min(0).max(100),
});

// Doubt scores schema
export const DoubtScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  deprecation: z.number().min(0).max(100),
  incompleteness: z.number().min(0).max(100),
  contradiction: z.number().min(0).max(100),
  obsolescence: z.number().min(0).max(100),
});

// Scores schema
export const ScoresSchema = z.object({
  confidence: ConfidenceScoresSchema,
  doubt: DoubtScoresSchema,
});

// Metadata schema
export const MetadataSchema = z.object({
  source: SourceSchema,
  created: z.string().datetime(),
  modified: z.string().datetime(),
  properties: z.record(z.unknown()),
});

// Knowledge Node schema
export const KnowledgeNodeSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  contentType: z.string(),
  projectId: z.string().uuid(),
  embedding: z.array(z.number()),
  metadata: MetadataSchema,
  scores: ScoresSchema,
  memoryLevel: z.enum(['sensory', 'working', 'semantic', 'episodic', 'procedural']),
  lastAccessed: z.string().datetime(),
  accessCount: z.number().int().min(0),
  importance: z.number().min(0).max(100),
});

// Type exports
export type Source = z.infer<typeof SourceSchema>;
export type ConfidenceScores = z.infer<typeof ConfidenceScoresSchema>;
export type DoubtScores = z.infer<typeof DoubtScoresSchema>;
export type Scores = z.infer<typeof ScoresSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type KnowledgeNode = z.infer<typeof KnowledgeNodeSchema>;
export type MemoryLevel = KnowledgeNode['memoryLevel'];

export interface Relationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: string;
  strength: number; // 0-1
  confidence: number; // 0-100
  metadata: {
    created: string;
    modified: string;
    properties: Record<string, any>;
  };
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  memoryLevel?: KnowledgeNode['memoryLevel'];
  minConfidence?: number;
  maxDoubt?: number;
  projectId?: string;
}

export interface MemoryManager {
  store(node: KnowledgeNode): Promise<KnowledgeNode>;
  retrieve(id: string): Promise<KnowledgeNode | null>;
  update(node: KnowledgeNode): Promise<KnowledgeNode>;
  delete(id: string): Promise<boolean>;
  search(query: string, options?: SearchOptions): Promise<KnowledgeNode[]>;
  connect(sourceId: string, targetId: string, relationship: Relationship): Promise<Relationship>;
  disconnect(relationshipId: string): Promise<boolean>;
  getRelationships(nodeId: string): Promise<Relationship[]>;
}
