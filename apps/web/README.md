# CollabSphere AI: Web Application

This is the main web application for CollabSphere AI, providing the user interface for interacting with the system, visualizing knowledge graphs, and managing projects and integrations.

## Responsibilities

- Build core application UI (3 main pages)
- Develop visualization interface
- Create integration management UI
- Implement query interface

## Application Structure

```
web/
├── app/                        # Next.js app directory
│   ├── (auth)/                 # Authentication routes
│   ├── dashboard/              # Main dashboard
│   ├── projects/               # Project management
│   ├── knowledge/              # Knowledge graph visualization
│   ├── query/                  # Query interface
│   └── integrations/           # Integration management
├── components/                 # App-specific components
├── lib/                        # App-specific utilities
└── public/                     # Static assets
```

## Key Features

### Dashboard

- Project overview with statistics
- Recent queries and responses
- Knowledge completion metrics
- Quick actions for common tasks

### Knowledge Graph Visualization

- Interactive graph exploration
- Confidence/doubt color coding
- Filtering by memory level, confidence, etc.
- Detailed node and relationship inspection
- Search within the knowledge graph

### Query Interface

- Natural language query input
- Response display with confidence indicators
- Source citations and credibility indicators
- Knowledge gap identification
- Follow-up suggestions

### Integration Management

- Available connector listing
- Connector configuration
- Integration status monitoring
- Manual sync triggering
- Connector authentication

## Implementation Plan (1 Month)

### Week 1: Core Application Structure

1. Create application shell with navigation
2. Implement simple authentication system
3. Build responsive layouts
4. Set up state management
5. Implement basic routing

### Week 2: Query Interface

1. Create query input component
2. Build response display with confidence indicators
3. Implement history tracking
4. Create source citation display
5. Develop simple knowledge exploration from results

### Week 3: Knowledge Visualization

1. Implement basic interactive knowledge graph
2. Add confidence/doubt coloring
3. Build filtering capabilities
4. Create node and relationship inspection
5. Implement simple search functionality

### Week 4: Integration Management & Dashboard

1. Build connector listing and status display
2. Create configuration interface for connectors
3. Implement dashboard with key metrics
4. Add project management functionality
5. Create user preferences and settings

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query, SWR
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn/UI
- **Visualizations**: From `@collabsphere/ui`

## Integration Points

### Input

The web application consumes APIs from:
- Black Box (Raman) for queries and knowledge graph data
- Intake Layer (Taiwei) for connector management

### Output

The web application sends:
- Queries to the Black Box API
- Connector configuration to the Intake Layer API

## Getting Started

1. Install dependencies
   ```bash
   pnpm install
   ```

2. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Add API endpoints and other configuration
   ```

3. Start development
   ```bash
   pnpm dev
   ```

## Page Structure

### Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Project Selector, User Menu                         │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌───────────────────┐ ┌─────────────┐ │
│ │                   │ │                   │ │             │ │
│ │  Knowledge Stats  │ │  Recent Queries   │ │  Knowledge  │ │
│ │                   │ │                   │ │  Gaps       │ │
│ └───────────────────┘ └───────────────────┘ └─────────────┘ │
│ ┌───────────────────────────┐ ┌─────────────────────────┐   │
│ │                           │ │                         │   │
│ │  Knowledge Graph Preview  │ │  Connector Status       │   │
│ │                           │ │                         │   │
│ └───────────────────────────┘ └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Knowledge Graph (`/knowledge`)

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Project Selector, Filters, Search                   │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────┐ ┌───────────────┐ │
│ │                                       │ │               │ │
│ │                                       │ │  Node         │ │
│ │                                       │ │  Details      │ │
│ │  Interactive Knowledge Graph          │ │               │ │
│ │                                       │ │  - Content    │ │
│ │                                       │ │  - Metadata   │ │
│ │                                       │ │  - Confidence │ │
│ │                                       │ │  - Sources    │ │
│ │                                       │ │  - Relations  │ │
│ │                                       │ │               │ │
│ └───────────────────────────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Query Interface (`/query`)

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Project Selector, History                           │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Query Input                                           │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────────┐   │
│ │                                                       │   │
│ │ Response with Confidence/Doubt Indicators             │   │
│ │                                                       │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌────────────────────┐ ┌────────────────────────────────┐   │
│ │                    │ │                                │   │
│ │  Source Citations  │ │  Knowledge Graph for Query     │   │
│ │                    │ │                                │   │
│ └────────────────────┘ └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Performance Requirements

- First contentful paint < 2s
- Time to interactive < 3s
- 30fps for animations
- Optimized for datasets up to 1000 nodes
- Progressive loading for large data

## Documentation

Please document all components and pages. Include:

- Component props and interfaces
- State management patterns
- API integration details
- User flow diagrams
- Accessibility considerations 