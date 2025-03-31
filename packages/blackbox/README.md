# CollabSphere AI: Black Box & Memory System

This package contains the core Black Box memory system for CollabSphere AI, responsible for implementing the 5-level memory architecture, confidence/doubt scoring, knowledge processing pipeline, and query-to-response system.

## Responsibilities

- Implement core memory architecture (5 levels)
- Build confidence/doubt scoring system
- Develop knowledge processing pipeline
- Create query-to-response system

## Package Structure

```
blackbox/
├── memory/                     # Memory system implementation
│   ├── sensory/                # Sensory memory implementation
│   ├── working/                # Working memory implementation
│   ├── semantic/               # Semantic memory implementation
│   ├── episodic/               # Episodic memory implementation
│   └── procedural/             # Procedural memory implementation
├── scoring/                    # Confidence/doubt scoring system
├── processing/                 # Knowledge processing pipeline
├── query/                      # Query processing system
└── api/                        # Black box API endpoints
```

## Implementation Plan (1 Month)

### Week 1: Memory Infrastructure

1. Set up database infrastructure
2. Implement basic memory manager interfaces
3. Build simple cross-database transaction management
4. Create basic memory level transfer mechanism
5. Develop minimal memory monitoring system

### Week 2: Processing Pipeline

1. Implement content parsing system
2. Build metadata extraction and classification
3. Create source credibility assessment
4. Develop content quality evaluation
5. Build simplified confidence/doubt scoring algorithms

### Week 3: Knowledge Graph

1. Design basic knowledge schema
2. Implement simple relationship detection
3. Create connection strength calculator
4. Build graph update mechanisms
5. Develop basic memory consolidation system

### Week 4: Query-Response System

1. Build query analysis system
2. Implement basic memory search
3. Create simplified knowledge gap detection
4. Develop response assembly system
5. Build confidence filtering and marking

## Multi-Level Memory Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │      │             │      │             │
│  Sensory    │      │  Working    │      │  Semantic   │      │  Episodic   │      │ Procedural  │
│  Memory     │──────►  Memory     │──────►  Memory     │──────►  Memory     │──────►  Memory     │
│             │      │             │      │             │      │             │      │             │
│  (Redis)    │      │ (Redis +    │      │ (Neo4j +    │      │ (MongoDB +  │      │ (MongoDB)   │
│             │      │ TimescaleDB)│      │  Weaviate)  │      │ TimescaleDB)│      │             │
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