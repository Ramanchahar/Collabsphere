/**
 * Neo4j Database Configuration
 * 
 * This module provides configuration for Neo4j database connections and schema definitions
 * for semantic memory operations.
 */

import { z } from 'zod';
import neo4j, { Driver } from 'neo4j-driver';

// Neo4j configuration schema
export const Neo4jConfigSchema = z.object({
  uri: z.string().url(),
  user: z.string(),
  password: z.string(),
  maxConnectionPoolSize: z.number().int().positive().default(50),
  connectionTimeout: z.number().int().positive().default(30000),
  maxTransactionRetryTime: z.number().int().positive().default(30000),
});

export type Neo4jConfig = z.infer<typeof Neo4jConfigSchema>;

// Default configuration
export const defaultNeo4jConfig: Neo4jConfig = {
  uri: 'bolt://localhost:7687',
  user: 'neo4j',
  password: 'test_password',
  maxConnectionPoolSize: 50,
  connectionTimeout: 30000,
  maxTransactionRetryTime: 30000,
};

// Neo4j client creation function
export function createNeo4jDriver(config: Neo4jConfig): Driver {
  return neo4j.driver(
    config.uri,
    neo4j.auth.basic(config.user, config.password),
    {
      maxConnectionPoolSize: config.maxConnectionPoolSize,
      connectionTimeout: config.connectionTimeout,
      maxTransactionRetryTime: config.maxTransactionRetryTime,
    }
  );
}

// Neo4j schema definitions
export const Neo4jSchema = {
  // Node labels
  NODE_LABELS: {
    KNOWLEDGE: 'Knowledge',
    CONCEPT: 'Concept',
    SOURCE: 'Source',
    PROJECT: 'Project',
  },

  // Relationship types
  RELATIONSHIP_TYPES: {
    BELONGS_TO: 'BELONGS_TO',
    REFERENCES: 'REFERENCES',
    SIMILAR_TO: 'SIMILAR_TO',
    DEPENDS_ON: 'DEPENDS_ON',
    IMPLEMENTS: 'IMPLEMENTS',
    EXTENDS: 'EXTENDS',
  },

  // Indexes
  INDEXES: [
    // Knowledge node indexes
    'CREATE INDEX knowledge_id IF NOT EXISTS FOR (k:Knowledge) ON (k.id)',
    'CREATE INDEX knowledge_content_type IF NOT EXISTS FOR (k:Knowledge) ON (k.contentType)',
    'CREATE INDEX knowledge_project_id IF NOT EXISTS FOR (k:Knowledge) ON (k.projectId)',
    'CREATE INDEX knowledge_created_at IF NOT EXISTS FOR (k:Knowledge) ON (k.createdAt)',
    'CREATE INDEX knowledge_confidence IF NOT EXISTS FOR (k:Knowledge) ON (k.confidence)',
    
    // Concept node indexes
    'CREATE INDEX concept_id IF NOT EXISTS FOR (c:Concept) ON (c.id)',
    'CREATE INDEX concept_name IF NOT EXISTS FOR (c:Concept) ON (c.name)',
    'CREATE INDEX concept_project_id IF NOT EXISTS FOR (c:Concept) ON (c.projectId)',
    
    // Source node indexes
    'CREATE INDEX source_id IF NOT EXISTS FOR (s:Source) ON (s.id)',
    'CREATE INDEX source_type IF NOT EXISTS FOR (s:Source) ON (s.type)',
    'CREATE INDEX source_url IF NOT EXISTS FOR (s:Source) ON (s.url)',
    
    // Project node indexes
    'CREATE INDEX project_id IF NOT EXISTS FOR (p:Project) ON (p.id)',
    'CREATE INDEX project_name IF NOT EXISTS FOR (p:Project) ON (p.name)',
  ],

  // Constraints
  CONSTRAINTS: [
    // Knowledge node constraints
    'CREATE CONSTRAINT knowledge_id_unique IF NOT EXISTS FOR (k:Knowledge) REQUIRE k.id IS UNIQUE',
    'CREATE CONSTRAINT knowledge_project_id_exists IF NOT EXISTS FOR (k:Knowledge) REQUIRE k.projectId IS NOT NULL',
    
    // Concept node constraints
    'CREATE CONSTRAINT concept_id_unique IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE',
    'CREATE CONSTRAINT concept_project_id_exists IF NOT EXISTS FOR (c:Concept) REQUIRE c.projectId IS NOT NULL',
    
    // Source node constraints
    'CREATE CONSTRAINT source_id_unique IF NOT EXISTS FOR (s:Source) REQUIRE s.id IS UNIQUE',
    'CREATE CONSTRAINT source_url_unique IF NOT EXISTS FOR (s:Source) REQUIRE s.url IS UNIQUE',
    
    // Project node constraints
    'CREATE CONSTRAINT project_id_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE',
    'CREATE CONSTRAINT project_name_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.name IS UNIQUE',
  ],
}; 