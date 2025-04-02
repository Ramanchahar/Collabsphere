import { z } from 'zod';

// Relationship metadata schema
export const RelationshipMetadataSchema = z.object({
  created: z.string().datetime(),
  modified: z.string().datetime(),
  properties: z.record(z.unknown()),
});

// Relationship schema
export const RelationshipSchema = z.object({
  id: z.string().uuid(),
  sourceNodeId: z.string().uuid(),
  targetNodeId: z.string().uuid(),
  type: z.string(),
  strength: z.number().min(0).max(1),
  confidence: z.number().min(0).max(100),
  metadata: RelationshipMetadataSchema,
});

// Type exports
export type RelationshipMetadata = z.infer<typeof RelationshipMetadataSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;

// Common relationship types
export enum RelationshipType {
  // Hierarchical relationships
  CONTAINS = 'CONTAINS',
  BELONGS_TO = 'BELONGS_TO',
  PARENT_OF = 'PARENT_OF',
  CHILD_OF = 'CHILD_OF',
  
  // Semantic relationships
  RELATED_TO = 'RELATED_TO',
  SIMILAR_TO = 'SIMILAR_TO',
  OPPOSITE_OF = 'OPPOSITE_OF',
  SYNONYM_OF = 'SYNONYM_OF',
  
  // Temporal relationships
  PRECEDES = 'PRECEDES',
  FOLLOWS = 'FOLLOWS',
  OCCURS_AT = 'OCCURS_AT',
  
  // Causal relationships
  CAUSES = 'CAUSES',
  CAUSED_BY = 'CAUSED_BY',
  IMPLIES = 'IMPLIES',
  IMPLIED_BY = 'IMPLIED_BY',
  
  // Project-specific relationships
  DEPENDS_ON = 'DEPENDS_ON',
  IMPLEMENTS = 'IMPLEMENTS',
  REFERENCES = 'REFERENCES',
  USES = 'USES',
}
