# CollabSphere AI Black Box

## Overview

The Black Box is the core brain of CollabSphere AI, implementing a revolutionary 5-level memory architecture with confidence/doubt assessment. It processes standardized input from the Intake Layer, organizes knowledge across memory levels, detects contradictions, and provides confidence-aware responses to queries.

## Current Progress

### Completed
1. Project Setup
   - Initialized monorepo structure
   - Set up TypeScript configuration
   - Configured Jest for testing
   - Set up ESLint and Prettier
   - Created basic project structure following the implementation plan

2. Dependencies Management
   - Set up package.json with core dependencies
   - Configured workspace dependencies
   - Resolved dependency conflicts
   - Set up shared TypeScript and ESLint configurations

3. Testing Infrastructure
   - Created test setup file
   - Configured database mocks (MongoDB, Redis, Neo4j, Weaviate, PostgreSQL)
   - Set up global test utilities
   - Implemented basic test cleanup

4. Core Data Structures
   - Implemented KnowledgeNode interface with comprehensive metadata and scoring
   - Created Relationship interface for knowledge graph connections
   - Defined MemoryManager interface for memory level operations
   - Added SearchOptions interface for flexible querying

5. Database Implementations
   - Redis client for sensory memory with connection pooling and error handling
   - PostgreSQL client for working memory with transaction support
   - Neo4j client for semantic memory with graph operations
   - Weaviate client for vector storage with similarity search
   - MongoDB client for long-term memory with document operations

6. Database Testing and Integration
   - Set up Docker containers for each database type
   - Created specialized test containers with proper configuration
   - Implemented connection health checks
   - Created database schema setup scripts
   - Fixed authentication and connectivity issues
   - Added troubleshooting scripts for database maintenance
   - Verified all database connections working properly

### In Progress
1. Streaming Data Processing Pipeline
   - Designing standardized chunk data format
   - Creating test data generator for streaming
   - Implementing chunk ingestion system

### Next Steps
1. Data Streaming Implementation
   - Create a system to stream chunks from dummy-test-data.ts into Blackbox
   - Implement chunk retrieval within Blackbox
   - Set up real-time processing of incoming data streams
   - Create monitoring and validation for data flow

2. Knowledge Flow Implementation (from Knowledge Flow document)
   - Implement extraction and normalization layer
   - Create knowledge node generation with metadata
   - Build classification and categorization system
   - Develop confidence and doubt scoring mechanisms
   - Implement memory level assignment and promotion
   - Set up knowledge graph relationship detection
   - Create conflict and redundancy detection

3. Query to Response Implementation (from Query-to-Response Flow document)
   - Implement query analysis and intent detection
   - Create memory search across all levels
   - Build knowledge synthesis mechanism
   - Implement confidence-aware response generation
   - Create follow-up question generation
   - Develop learning from feedback loop
   - Implement explanation generation with confidence indicators

## Testing Strategy

### Database Testing Approach
1. **Unit Tests**
   - Mock database connections
   - Test individual client methods
   - Validate error handling
   - Verify data transformations

2. **Integration Tests**
   - Use Docker containers for each database
   - Test actual database connections
   - Validate CRUD operations
   - Test transaction handling
   - Verify connection pooling

3. **Performance Tests**
   - Measure query response times
   - Test concurrent operations
   - Validate connection pool efficiency
   - Monitor resource usage

4. **Error Handling Tests**
   - Test connection failures
   - Validate retry mechanisms
   - Test transaction rollbacks
   - Verify error reporting

### Database Setup for Testing
1. **Docker Compose Configuration**
   ```yaml
   services:
     redis:
       image: redis:latest
       ports:
         - "6379:6379"
     
     postgres:
       image: postgres:latest
       ports:
         - "5432:5432"
     
     neo4j:
       image: neo4j:latest
       ports:
         - "7474:7474"
         - "7687:7687"
     
     weaviate:
       image: semitechnologies/weaviate:latest
       ports:
         - "8080:8080"
     
     mongodb:
       image: mongo:latest
       ports:
         - "27017:27017"
   ```

2. **Test Environment Setup**
   - Create separate test databases
   - Initialize test schemas
   - Set up test data fixtures
   - Configure test-specific connection parameters

3. **Test Data Management**
   - Create test data generators
   - Implement data cleanup procedures
   - Set up data isolation between tests
   - Manage test data versioning

## Core Data Structures

### KnowledgeNode
```typescript
interface KnowledgeNode {
  id: string;
  content: string;
  contentType: string;
  projectId: string;
  embedding: number[];
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
  scores: {
    confidence: {
      overall: number; // 0-100
      informationQuality: number; // 0-100
      sourceCredibility: number; // 0-100
      usageEvidence: number; // 0-100
      technicalAccuracy: number; // 0-100
    };
    doubt: {
      overall: number; // 0-100
      deprecation: number; // 0-100
      incompleteness: number; // 0-100
      contradiction: number; // 0-100
      obsolescence: number; // 0-100
    };
  };
  memoryLevel: "sensory" | "working" | "semantic" | "episodic" | "procedural";
  lastAccessed: string;
  accessCount: number;
  importance: number; // 0-100
}
```

### Relationship
```typescript
interface Relationship {
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
```

### MemoryManager
```typescript
interface MemoryManager {
  store(node: KnowledgeNode): Promise<KnowledgeNode>;
  retrieve(id: string): Promise<KnowledgeNode | null>;
  update(node: KnowledgeNode): Promise<KnowledgeNode>;
  delete(id: string): Promise<boolean>;
  search(query: string, options?: SearchOptions): Promise<KnowledgeNode[]>;
  connect(sourceId: string, targetId: string, relationship: Relationship): Promise<Relationship>;
  disconnect(relationshipId: string): Promise<boolean>;
  getRelationships(nodeId: string): Promise<Relationship[]>;
}
```

## Project Structure

```
packages/blackbox/
├── src/
│   ├── processing/               # Processing Pipeline
│   ├── memory/                   # Memory Integration System
│   ├── query/                    # Query Processing System
│   ├── response/                 # Response Generation System
│   ├── shared/                   # Shared utilities
│   │   └── types/               # Core data structure types
│   └── api/                      # API layer
├── tests/                        # Test files
├── scripts/                      # Build and development scripts
├── config/                       # Configuration files
└── docs/                         # Documentation
```

## Development

### Prerequisites
- Node.js (v18 or higher)
- pnpm (for package management)
- Docker (for local database instances)

### Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   pnpm dev
   ```

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test <filename>
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

Proprietary - All rights reserved

## Multi-Level Memory Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │      │             │      │             │
│  Sensory    │      │  Working    │      │  Semantic   │      │  Episodic   │      │ Procedural  │
│  Memory     │──────►  Memory     │──────►  Memory     │──────►  Memory     │──────►  Memory     │
│             │      │             │      │             │      │             │      │             │
│  (Redis)    │      │ (Redis +    │      │ (Neo4j +    │      │ (MongoDB +  │      │ (MongoDB)   │
│             │      │ PostgreSQL) │      │  Weaviate)  │      │ PostgreSQL) │      │             │
│             │      │             │      │             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
```

Each memory level has specific responsibilities and storage characteristics:

1. **Sensory Memory**: Initial intake processing, raw content storage
2. **Working Memory**: Active processing, temporary knowledge graph 
3. **Semantic Memory**: Structured knowledge network, confidence/doubt scores
4. **Episodic Memory**: Context and history, temporal sequences
5. **Procedural Memory**: Process workflows, execution patterns

## Integration Points

### Input

The Black Box system receives standardized content from the Intake Layer (Taiwei) using the `StandardizedContent` interface defined in `@collabsphere/core`.

### Output

The Black Box system provides query responses and knowledge graph data to the Frontend (Himalaya) using the `QueryResponse` and `KnowledgeGraphResponse` interfaces defined in `@collabsphere/core`.

```typescript
// Example of returning a query response
const queryResponse: QueryResponse = {
  id: "query-123",
  projectId: "project-123",
  query: "What is the latest documentation on X?",
  responseContent: "The latest documentation on X was published on June 15, 2023...",
  overallConfidence: 85,
  overallDoubt: 15,
  explainedConfidence: "High confidence based on official documentation with recent updates",
  sources: [
    {
      nodeId: "node-123",
      title: "X Documentation",
      url: "https://example.com/docs/x",
      confidence: 90,
      relevance: 95,
      snippet: "X is a system that provides..."
    }
  ],
  processingTime: 150,
  timestamp: new Date().toISOString()
};
```

## Confidence/Doubt Matrix

The Black Box implements a sophisticated dual-scoring system:

### Confidence Scoring (0-100)
- **Information Quality Score**: Completeness, clarity, examples, edge cases
- **Source Credibility Score**: Official vs third-party, author reputation, maintenance
- **Usage Evidence Score**: Adoption metrics, implementation examples, community activity
- **Technical Accuracy Score**: Correctness, implementation feasibility, security considerations

### Doubt Scoring (0-100)
- **Deprecation Signals**: Warnings, replacement recommendations, end-of-life notices
- **Incompleteness Indicators**: Missing information, undocumented edge cases, implementation gaps
- **Contradiction Detection**: Conflicting approaches, inconsistent usage
- **Obsolescence Risk**: Age, compatibility, alternative approaches

## Getting Started

1. Install dependencies
   ```bash
   pnpm install
   ```

2. Set up database infrastructure
   ```bash
   docker-compose up -d
   ```

3. Start development
   ```bash
   pnpm dev
   ```

## Integration with Other Teams

- **Taiwei (Intake Layer)**: Receive standardized content from the intake system through API endpoints.
- **Himalaya (Frontend)**: Provide query processing and knowledge graph visualization data through API endpoints.
- **Sagnik (Evaluation)**: Expose performance metrics and test interfaces for evaluation.

## API Endpoints

The Black Box should expose the following API endpoints:

- `POST /api/blackbox/intake` - Process incoming standardized content
- `POST /api/blackbox/query` - Process a query and return a response
- `GET /api/blackbox/knowledge-graph` - Get knowledge graph data for visualization
- `GET /api/blackbox/projects/:id/stats` - Get statistics for a project
- `GET /api/blackbox/projects/:id/gaps` - Get identified knowledge gaps for a project

## Performance Requirements (MVP)

1. **Processing Throughput**
   - Process minimum 20 chunks/second
   - Query response time <1s for p95
   - Basic memory transfer functionality

2. **Scaling Requirements**
   - Handle 100,000+ nodes per project for MVP
   - Support 10+ simultaneous users
   - Process 10+ queries per second

## Documentation

Please document all public APIs and interfaces. Each memory level should include:

- Storage strategy
- Data access patterns
- Consolidation rules
- Forgetting mechanisms

# Blackbox Package

## Overview
The Blackbox package is a core component of the CollabSphere project, implementing the cognitive architecture for processing and managing information across different memory layers. It provides a robust foundation for handling sensory, working, and semantic memory operations.

## Features

### Memory Layer Management
- **Sensory Memory**: Temporary storage and initial processing of incoming information
- **Working Memory**: Active processing and manipulation of information
- **Semantic Memory**: Long-term storage and retrieval of processed information

### Database Implementations
- **Redis**: Handles sensory memory operations with fast, in-memory storage
  - Raw chunk storage
  - Processing queue management
  - Batch tracking
  - Rate limiting
  - Health monitoring

- **PostgreSQL**: Manages working memory with structured data storage
  - Chunk storage and retrieval
  - Processing status tracking
  - Confidence scoring
  - Batch operations
  - Vector similarity search

- **Neo4j**: Powers semantic memory with graph-based storage
  - Knowledge graph construction
  - Relationship management
  - Semantic search
  - Pattern recognition

## Project Structure

```
packages/blackbox/
├── src/
│   ├── database/
│   │   ├── redis/           # Redis client for sensory memory
│   │   ├── postgres/        # PostgreSQL client for working memory
│   │   └── neo4j/          # Neo4j client for semantic memory
│   ├── memory/
│   │   ├── sensory/        # Sensory memory implementation
│   │   ├── working/        # Working memory implementation
│   │   └── semantic/       # Semantic memory implementation
│   └── shared/
│       └── types/          # Shared type definitions
├── tests/                  # Test files
└── package.json           # Package configuration
```

## Installation

```bash
npm install @collabsphere/blackbox
```

## Usage

### Database Clients

```typescript
// Redis Client for Sensory Memory
import { SensoryMemoryClient } from '@collabsphere/blackbox/database/redis';

// PostgreSQL Client for Working Memory
import { WorkingMemoryClient } from '@collabsphere/blackbox/database/postgres';

// Neo4j Client for Semantic Memory
import { SemanticMemoryClient } from '@collabsphere/blackbox/database/neo4j';
```

### Memory Layer Operations

```typescript
// Sensory Memory Operations
import { SensoryMemory } from '@collabsphere/blackbox/memory/sensory';

// Working Memory Operations
import { WorkingMemory } from '@collabsphere/blackbox/memory/working';

// Semantic Memory Operations
import { SemanticMemory } from '@collabsphere/blackbox/memory/semantic';
```

## Configuration

Each database client can be configured with custom settings:

```typescript
// Redis Configuration
const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: 'your-password',
  // ... other Redis options
};

// PostgreSQL Configuration
const postgresConfig = {
  host: 'localhost',
  port: 5432,
  database: 'collabsphere_working_memory',
  user: 'postgres',
  password: 'your-password',
  // ... other PostgreSQL options
};

// Neo4j Configuration
const neo4jConfig = {
  uri: 'bolt://localhost:7687',
  user: 'neo4j',
  password: 'your-password',
  // ... other Neo4j options
};
```

## Development

### Prerequisites
- Node.js (v16 or higher)
- Redis
- PostgreSQL (with vector extension)
- Neo4j

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development servers:
   ```bash
   npm run dev
   ```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/database/redis/client.test.ts
```

### Linting
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 