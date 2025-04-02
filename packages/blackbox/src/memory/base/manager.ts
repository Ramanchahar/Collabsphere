import { KnowledgeNode, MemoryLevel } from '@/shared/types/node';
import { Relationship } from '@/shared/types/relationship';

export interface SearchOptions {
  limit?: number;
  offset?: number;
  minConfidence?: number;
  maxDoubt?: number;
  memoryLevels?: MemoryLevel[];
  projectId?: string;
}

export interface MemoryManager {
  // Node operations
  store(node: KnowledgeNode): Promise<KnowledgeNode>;
  retrieve(id: string): Promise<KnowledgeNode | null>;
  update(node: KnowledgeNode): Promise<KnowledgeNode>;
  delete(id: string): Promise<boolean>;
  
  // Search operations
  search(query: string, options?: SearchOptions): Promise<KnowledgeNode[]>;
  searchByEmbedding(embedding: number[], options?: SearchOptions): Promise<KnowledgeNode[]>;
  
  // Relationship operations
  connect(sourceId: string, targetId: string, relationship: Relationship): Promise<Relationship>;
  disconnect(relationshipId: string): Promise<boolean>;
  getRelationships(nodeId: string): Promise<Relationship[]>;
  
  // Memory level specific operations
  transfer(node: KnowledgeNode, targetLevel: MemoryLevel): Promise<KnowledgeNode>;
  consolidate(): Promise<void>;
  
  // Utility operations
  getStats(): Promise<{
    nodeCount: number;
    relationshipCount: number;
    memoryUsage: number;
    lastConsolidation: Date;
  }>;
  
  // Lifecycle operations
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}
