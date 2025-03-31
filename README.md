# CollabSphere AI

CollabSphere AI is a revolutionary brain-inspired intelligence system that transforms how machines organize, evaluate, and utilize knowledge. Using a multi-level memory architecture with confidence/doubt assessment, real-time visualization, and autonomous learning capabilities, CollabSphere AI addresses critical limitations in current AI memory systems.

## Project Vision

CollabSphere AI aims to surpass standard RAG systems by 90%+ through our brain-inspired multi-level memory architecture and confidence/doubt scoring system. Our MVP will demonstrate:

- Knowledge integration from Notion (first connector)
- 5-level memory architecture (sensory, working, semantic, episodic, procedural)
- Dual confidence/doubt scoring system
- Interactive knowledge visualization
- Project-based knowledge organization

## Team Structure & Responsibilities

### High-Level Structure

Each team member has designated areas of the codebase to focus on:

```
collabsphere/
├── apps/                      # Himalaya: Web applications
├── packages/
│   ├── core/                  # Shared: Core types and utilities
│   ├── intake/                # Taiwei: Intake layer and connectors
│   ├── blackbox/              # Raman: Memory system and processing
│   ├── evaluation/            # Sagnik: Evaluation and benchmarking
│   └── ui/                    # Himalaya: Shared UI components
├── services/                  # Deployed standalone services
├── tools/                     # Development and build tools
├── docker/                    # Docker configurations
└── docs/                      # Internal documentation
```

### Taiwei: Input Source & Intake Layer

**Location**: `packages/intake/`

**Primary Responsibilities:**
- Develop Notion connector as initial integration
- Build extensible intake layer architecture
- Create standardized format for all incoming data
- Design plugin/integration system for future connectors

**Key Files to Work On:**
- `packages/intake/connectors/notion/` - Notion connector implementation
- `packages/intake/transformation/` - Data transformation pipeline
- `packages/intake/registry/` - Connector registry
- `packages/intake/api/` - Intake API endpoints

### Raman: Black Box & Memory System

**Location**: `packages/blackbox/`

**Primary Responsibilities:**
- Implement core memory architecture (5 levels)
- Build confidence/doubt scoring system
- Develop knowledge processing pipeline
- Create query-to-response system

**Key Files to Work On:**
- `packages/blackbox/memory/` - Memory system implementation
- `packages/blackbox/scoring/` - Confidence/doubt scoring system
- `packages/blackbox/processing/` - Knowledge processing pipeline
- `packages/blackbox/query/` - Query processing system

### Sagnik: Research & Evaluation

**Location**: `packages/evaluation/`

**Primary Responsibilities:**
- Prepare evaluation datasets
- Benchmark competitor models
- Design evaluation methodology
- Compare CollabSphere performance

**Key Files to Work On:**
- `packages/evaluation/datasets/` - Evaluation datasets
- `packages/evaluation/benchmarks/` - Benchmark implementations
- `packages/evaluation/metrics/` - Evaluation metrics
- `packages/evaluation/competitors/` - Competitor system implementations

### Himalaya: Frontend & User Experience

**Location**: `apps/web/`, `packages/ui/`

**Primary Responsibilities:**
- Update company website
- Build core application UI (3 pages)
- Develop visualization interface
- Create integration management UI

**Key Files to Work On:**
- `apps/web/app/` - Next.js application
- `packages/ui/visualizations/` - Data visualization components
- `apps/web/app/integrations/` - Integration management UI
- `apps/docs/` - Company website

## Complete Project Structure

```
collabsphere/
├── apps/
│   ├── web/                    # Himalaya: Main Next.js web application
│   │   ├── app/                # Next.js App Router structure
│   │   │   ├── (auth)/         # Authentication routes
│   │   │   │   ├── login/      # Login page
│   │   │   │   └── register/   # Registration page
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── projects/       # Project management
│   │   │   │   └── [id]/       # Single project view
│   │   │   ├── knowledge/      # Knowledge graph visualization
│   │   │   ├── query/          # Query interface
│   │   │   └── integrations/   # Integration management
│   │   │       └── [id]/       # Integration configuration
│   │   ├── components/         # App-specific components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── knowledge/      # Knowledge graph components
│   │   │   ├── query/          # Query interface components
│   │   │   └── layout/         # Layout components
│   │   ├── lib/                # App-specific utilities
│   │   └── public/             # Static assets
│   ├── docs/                   # Himalaya: Company website/documentation
│   │   ├── app/                # Next.js App Router structure
│   │   │   ├── about/          # About page
│   │   │   ├── blog/           # Blog page
│   │   │   └── contact/        # Contact page
│   │   ├── components/         # Website-specific components
│   │   └── public/             # Static assets
│   └── admin/                  # Himalaya: Admin dashboard
│       ├── app/                # Next.js App Router structure
│       │   ├── users/          # User management
│       │   └── settings/       # System settings
│       ├── components/         # Admin-specific components
│       └── public/             # Static assets
├── packages/
│   ├── core/                   # Shared core functionality and types
│   │   ├── types/              # Shared TypeScript interfaces
│   │   │   ├── connectors.ts   # Connector interfaces
│   │   │   ├── memory.ts       # Memory system types
│   │   │   └── api.ts          # API response types
│   │   ├── utils/              # Shared utilities
│   │   ├── constants/          # Shared constants
│   │   └── config/             # Configuration management
│   ├── intake/                 # Taiwei: Intake layer and connectors
│   │   ├── connectors/         # Connector implementations
│   │   │   ├── notion/         # Notion connector implementation
│   │   │   └── base/           # Base connector classes
│   │   ├── transformation/     # Data transformation pipeline
│   │   ├── registry/           # Connector registry
│   │   ├── auth/               # Authentication handling
│   │   └── api/                # Intake API endpoints
│   ├── blackbox/               # Raman: Memory system and processing
│   │   ├── memory/             # Memory system implementation
│   │   │   ├── sensory/        # Sensory memory implementation
│   │   │   ├── working/        # Working memory implementation
│   │   │   ├── semantic/       # Semantic memory implementation
│   │   │   ├── episodic/       # Episodic memory implementation
│   │   │   └── procedural/     # Procedural memory implementation
│   │   ├── scoring/            # Confidence/doubt scoring system
│   │   ├── processing/         # Knowledge processing pipeline
│   │   ├── query/              # Query processing system
│   │   └── api/                # Black box API endpoints
│   ├── evaluation/             # Sagnik: Evaluation and benchmarking
│   │   ├── datasets/           # Evaluation datasets
│   │   │   ├── technical/      # Technical documentation datasets
│   │   │   └── academic/       # Academic paper datasets
│   │   ├── benchmarks/         # Benchmark implementations
│   │   ├── metrics/            # Evaluation metrics
│   │   ├── competitors/        # Competitor system implementations
│   │   ├── visualization/      # Results visualization
│   │   └── reports/            # Analysis and reporting
│   └── ui/                     # Himalaya: Shared UI components
│       ├── components/         # Shared UI components
│       ├── hooks/              # React hooks
│       ├── visualizations/     # Data visualization components
│       ├── styles/             # Shared styles
│       └── utils/              # UI utilities
├── services/                   # Deployed services
│   ├── api/                    # Main API service
│   │   ├── routes/             # API route handlers
│   │   └── middleware/         # API middleware
│   ├── worker/                 # Background processing
│   │   └── jobs/               # Worker job definitions
│   └── connectors/             # Connector services
│       └── notion/             # Notion connector service
├── tools/                      # Development and build tools
│   ├── generators/             # Code generators
│   └── scripts/                # Development scripts
├── docker/                     # Docker configurations
│   ├── api/                    # API service Docker configuration
│   ├── worker/                 # Worker service Docker configuration
│   └── web/                    # Web application Docker configuration
└── docs/                       # Internal documentation
    ├── architecture/           # Architecture documentation
    ├── api/                    # API documentation
    ├── development/            # Development guides
    └── evaluation/             # Evaluation methodology
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.0+
- Docker and Docker Compose
- Git

### Development Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/collabsphere/collabsphere-ai.git
   cd collabsphere-ai
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development infrastructure**

   ```bash
   docker-compose up -d
   ```

   This will start the required services:
   - Redis (for Sensory and Working Memory)
   - MongoDB (for Episodic and Procedural Memory)
   - Neo4j (for Semantic Memory)
   - Weaviate (for vector storage)
   - TimescaleDB (for time-series data)
   - RabbitMQ (for messaging)

5. **Start the development environment**
   ```bash
   pnpm dev
   ```

### Team-Specific Setup Instructions

#### Taiwei (Intake Layer)

1. **Notion API Setup**
   - Create a Notion integration at https://www.notion.so/my-integrations
   - Add the API key to your `.env` file
   - Configure the OAuth redirect URI if needed

2. **Testing Connectors**
   ```bash
   # Run tests for Notion connector
   pnpm --filter @collabsphere/intake test
   
   # Start only the intake API
   pnpm --filter @collabsphere/intake dev
   ```

3. **Resources**
   - Notion API documentation: https://developers.notion.com/
   - Refer to `packages/intake/README.md` for detailed implementation guidelines

#### Raman (Black Box)

1. **Database Access**
   - Ensure all database containers are running
   - Database connection strings are available in the `.env` file
   - Monitor memory system via the provided dashboard at http://localhost:3000/admin/memory

2. **Running Tests**
   ```bash
   # Run all black box tests
   pnpm --filter @collabsphere/blackbox test
   
   # Start only the black box API
   pnpm --filter @collabsphere/blackbox dev
   ```

3. **Resources**
   - Database client documentation:
     - Neo4j: https://neo4j.com/docs/javascript-manual/current/
     - Weaviate: https://weaviate.io/developers/weaviate/client-libraries/typescript
   - Refer to `packages/blackbox/README.md` for detailed implementation guidelines

#### Sagnik (Evaluation)

1. **Python Environment Setup**
   ```bash
   cd packages/evaluation
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Running Benchmarks**
   ```bash
   pnpm --filter @collabsphere/evaluation benchmark
   ```

3. **Resources**
   - LangChain documentation: https://js.langchain.com/docs/
   - LlamaIndex documentation: https://docs.llamaindex.ai/
   - Refer to `packages/evaluation/README.md` for detailed implementation guidelines

#### Himalaya (Frontend)

1. **UI Component Development**
   ```bash
   # Start Storybook for UI component development
   pnpm --filter @collabsphere/ui storybook
   
   # Start the web application
   pnpm --filter @collabsphere/web dev
   ```

2. **API Integration**
   - Black Box API will be available at http://localhost:3000/api/blackbox
   - Intake API will be available at http://localhost:3000/api/intake

3. **Resources**
   - Next.js documentation: https://nextjs.org/docs
   - Shadcn/UI documentation: https://ui.shadcn.com/
   - Refer to `packages/ui/README.md` and `apps/web/README.md` for detailed implementation guidelines

### Development Workflow

1. **Branch Structure**
   - `main` - Production branch, protected
   - `develop` - Development branch, merge to main for releases
   - Feature branches: `feature/<team>/<feature-name>`
   - Bugfix branches: `bugfix/<team>/<issue-name>`

2. **Pull Request Workflow**
   - Create a feature/bugfix branch from `develop`
   - Make your changes
   - Submit a PR to the `develop` branch
   - Assign a reviewer from your team
   - Merge after approval

3. **Code Standards**
   - All code should have TypeScript types
   - Follow the established project structure
   - Write unit tests for all critical functionality
   - Document public APIs and interfaces
   - Run linting before committing: `pnpm lint`

## Integration Points & Contracts

### Taiwei → Raman (Intake to Black Box)
- Standardized content chunks from `packages/core/types/connectors.ts`
- Integration via API defined in `packages/core/types/api.ts`
- Intake API endpoint: `POST /api/intake/content`

### Raman → Himalaya (Black Box to Frontend)
- Query responses and knowledge graph data from `packages/core/types/api.ts`
- Query API endpoint: `POST /api/blackbox/query`
- Knowledge graph API endpoint: `GET /api/blackbox/knowledge-graph`
- WebSocket connections for real-time updates

### Sagnik → All Teams
- Benchmark results will be shared via reports
- Performance metrics API: `GET /api/evaluation/metrics`
- Integration through standardized test interfaces

## Communication Channels

- **Weekly Team Sync**: Every Monday, 10:00 AM
- **Daily Updates**: Async updates in the team Slack channel
- **Technical Discussions**: Use GitHub Discussions for technical decisions
- **Documentation**: Update relevant README files and docs as you develop

## Success Metrics for MVP

- 90% improvement over standard RAG systems
- < 1s query response time for p95
- > 20 chunks/second processing throughput
- Clean visualization with 1000+ nodes

## Documentation

Additional documentation can be found in the `docs/` directory:
- Architecture diagrams
- API documentation
- Development guidelines
- Evaluation methodology
