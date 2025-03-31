# CollabSphere AI: UI Components

This package contains reusable UI components for the CollabSphere AI frontend, including data visualizations, shared components, hooks, and styles.

## Responsibilities

- Create shared UI components for all CollabSphere applications
- Develop data visualization components for knowledge graphs
- Implement reusable hooks for data fetching and state management
- Establish consistent styling across applications

## Package Structure

```
ui/
├── components/                 # Shared UI components
├── hooks/                      # React hooks
├── visualizations/             # Data visualization components
├── styles/                     # Shared styles
└── utils/                      # UI utilities
```

## Key Components

### Basic UI Elements

- Button
- Card
- Input
- Modal
- Dropdown
- Tabs
- Toast notifications
- Loading indicators

### Confidence/Doubt Display Components

- Confidence Badge
- Doubt Indicator
- Source Reliability Display
- Knowledge Quality Meter

### Knowledge Graph Visualization

- Interactive Graph View
- Node Details Panel
- Relationship Explorer
- Confidence/Doubt Color Gradient
- Filtering Controls

## Integration Points

This package will be used primarily by the web application (`apps/web/`) and potentially by other frontend applications (`apps/docs/`, `apps/admin/`).

## Tech Stack

- **Framework**: React
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn/UI
- **Visualization**: D3.js, Three.js
- **Graphs**: Cytoscape.js or React Flow
- **Animation**: Framer Motion

## Getting Started

1. Install dependencies
   ```bash
   pnpm install
   ```

2. Start Storybook for component development
   ```bash
   pnpm storybook
   ```

## Usage Examples

### Knowledge Graph Visualization

```tsx
import { KnowledgeGraph } from '@collabsphere/ui/visualizations';
import type { KnowledgeNode, Relationship } from '@collabsphere/core';

const MyComponent = ({ nodes, relationships }) => {
  return (
    <KnowledgeGraph
      nodes={nodes}
      relationships={relationships}
      onNodeClick={(node) => console.log('Node clicked:', node)}
      confidenceThreshold={70}
      maxNodes={100}
    />
  );
};
```

### Confidence Badge

```tsx
import { ConfidenceBadge } from '@collabsphere/ui/components';

const MyComponent = () => {
  return (
    <div>
      <ConfidenceBadge confidence={85} doubt={15} />
      <p>This information has high confidence.</p>
    </div>
  );
};
```

## Design Guidelines

### Colors

- **Confidence**: Blue spectrum (#0066FF to #C2DBFF)
- **Doubt**: Red spectrum (#FF0033 to #FFCCCC)
- **Primary**: #5900B2 (Deep Purple)
- **Secondary**: #00C2A3 (Teal)
- **Background**: #F5F5FC (Light Gray-Purple)
- **Text**: #333366 (Dark Blue-Purple)

### Typography

- **Headings**: Inter, sans-serif
- **Body**: Inter, sans-serif
- **Code**: JetBrains Mono, monospace

### Spacing

Based on 4px grid system:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Accessibility

All components should meet WCAG 2.1 AA standards:
- Proper contrast ratios
- Keyboard navigation
- Screen reader support
- Focus states

## Documentation

Each component should include:

- PropTypes/TypeScript interfaces
- Usage examples
- Accessibility considerations
- Edge cases and limitations 