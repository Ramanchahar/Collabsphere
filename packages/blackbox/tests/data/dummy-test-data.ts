/**
 * CollabSphere AI - Dummy Test Data
 * 
 * This file contains sample chunks in the standardized format
 * for testing the Black Box implementation.
 */

import { ContentType, StandardizedChunk, ChunkBatch } from '../../src/shared/types/standardized-chunk';

// Create dummy data for a project on brain-inspired AI systems
export const dummyChunks: StandardizedChunk[] = [
  // Chunk 1: Introduction heading
  {
    id: "chunk-001",
    connectorId: "notion-connector",
    content: "Brain-Inspired Memory Systems",
    contentType: ContentType.HEADING,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:00:00Z",
    modified: "2025-03-15T14:30:00Z",
    processedAt: "2025-04-01T08:00:00Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["artificial intelligence", "neuroscience", "memory systems"],
      tags: ["research", "core-concept"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems"],
      nextChunkId: "chunk-002",
      order: 1
    }
  },
  
  // Chunk 2: Introduction paragraph
  {
    id: "chunk-002",
    connectorId: "notion-connector",
    content: "Brain-inspired memory systems aim to replicate the efficiency, adaptability, and robustness of human memory in artificial intelligence. Unlike traditional computer memory, which operates as a static storage system, the human brain employs a dynamic, multi-level approach to information processing and retention.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:05:00Z",
    modified: "2025-03-15T14:35:00Z",
    processedAt: "2025-04-01T08:00:10Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["artificial intelligence", "neuroscience", "memory systems"],
      tags: ["research", "introduction"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems"],
      previousChunkId: "chunk-001",
      nextChunkId: "chunk-003",
      order: 2
    }
  },
  
  // Chunk 3: Memory Levels heading
  {
    id: "chunk-003",
    connectorId: "notion-connector",
    content: "The Five Levels of Memory",
    contentType: ContentType.HEADING,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:10:00Z",
    modified: "2025-03-15T14:40:00Z",
    processedAt: "2025-04-01T08:00:20Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["memory levels", "cognitive architecture", "memory systems"],
      tags: ["research", "framework", "core-concept"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Memory Levels"],
      previousChunkId: "chunk-002",
      nextChunkId: "chunk-004",
      order: 3
    },
    relationships: [
      {
        targetId: "page-456",
        type: "references"
      }
    ]
  },
  
  // Chunk 4: Sensory Memory
  {
    id: "chunk-004",
    connectorId: "notion-connector",
    content: "1. Sensory Memory: The first level of memory processing, sensory memory acts as a buffer for stimuli received through the senses. It retains impressions of sensory information after the original stimuli have ended. In AI systems, this corresponds to initial data intake and preprocessing before meaningful analysis begins.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:15:00Z",
    modified: "2025-03-15T14:45:00Z",
    processedAt: "2025-04-01T08:00:30Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["sensory memory", "memory levels", "memory systems"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Memory Levels"],
      previousChunkId: "chunk-003",
      nextChunkId: "chunk-005",
      order: 4
    }
  },
  
  // Chunk 5: Working Memory
  {
    id: "chunk-005",
    connectorId: "notion-connector",
    content: "2. Working Memory: This level holds a limited amount of information in an active, readily available state for a short period. It processes and manipulates information for cognitive tasks, reasoning, and decision-making. In AI, working memory represents the active processing space where current operations and temporary knowledge are maintained.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:20:00Z",
    modified: "2025-03-15T14:50:00Z",
    processedAt: "2025-04-01T08:00:40Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["working memory", "memory levels", "memory systems"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Memory Levels"],
      previousChunkId: "chunk-004",
      nextChunkId: "chunk-006",
      order: 5
    }
  },
  
  // Chunk 6: Semantic Memory
  {
    id: "chunk-006",
    connectorId: "notion-connector",
    content: "3. Semantic Memory: This level contains general world knowledge, concepts, facts, and meanings not tied to specific experiences. It represents organized knowledge that allows us to understand the world. In AI systems, semantic memory is the structured knowledge network of concepts, facts, and relationships.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:25:00Z",
    modified: "2025-03-15T14:55:00Z",
    processedAt: "2025-04-01T08:00:50Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["semantic memory", "memory levels", "memory systems"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Memory Levels"],
      previousChunkId: "chunk-005",
      nextChunkId: "chunk-007",
      order: 6
    }
  },
  
  // Chunk 7: Episodic Memory
  {
    id: "chunk-007",
    connectorId: "notion-connector",
    content: "4. Episodic Memory: This memory level stores specific events, experiences, and their contexts, allowing them to be explicitly recalled. It includes autobiographical memories. In AI, episodic memory contains the history of interactions, learning events, and contextual information about when and how knowledge was acquired.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:30:00Z",
    modified: "2025-03-15T15:00:00Z",
    processedAt: "2025-04-01T08:01:00Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["episodic memory", "memory levels", "memory systems"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Memory Levels"],
      previousChunkId: "chunk-006",
      nextChunkId: "chunk-008",
      order: 7
    }
  },
  
  // Chunk 8: Procedural Memory
  {
    id: "chunk-008",
    connectorId: "notion-connector",
    content: "5. Procedural Memory: This level contains knowledge about how to perform actions and skills, often operating below conscious awareness. It stores motor skills, habits, and routine procedures. In AI systems, procedural memory comprises processes, workflows, and execution patterns for information processing.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:35:00Z",
    modified: "2025-03-15T15:05:00Z",
    processedAt: "2025-04-01T08:01:10Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["procedural memory", "memory levels", "memory systems"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Memory Levels"],
      previousChunkId: "chunk-007",
      nextChunkId: "chunk-009",
      order: 8
    }
  },
  
  // Chunk 9: Confidence Scoring heading
  {
    id: "chunk-009",
    connectorId: "notion-connector",
    content: "Confidence and Doubt Scoring",
    contentType: ContentType.HEADING,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:40:00Z",
    modified: "2025-03-15T15:10:00Z",
    processedAt: "2025-04-01T08:01:20Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["confidence scoring", "doubt scoring", "information reliability"],
      tags: ["research", "framework", "core-concept"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Confidence Scoring"],
      previousChunkId: "chunk-008",
      nextChunkId: "chunk-010",
      order: 9
    },
    relationships: [
      {
        targetId: "page-789",
        type: "references"
      }
    ]
  },
  
  // Chunk 10: Confidence Scoring Introduction
  {
    id: "chunk-010",
    connectorId: "notion-connector",
    content: "A key innovation in brain-inspired memory systems is the implementation of dual confidence and doubt scoring. Unlike traditional AI systems that treat all information equally, this approach assigns separate scores for confidence (the degree of belief in the information's correctness) and doubt (the degree of skepticism or uncertainty).",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:45:00Z",
    modified: "2025-03-15T15:15:00Z",
    processedAt: "2025-04-01T08:01:30Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["confidence scoring", "doubt scoring", "information reliability"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Confidence Scoring"],
      previousChunkId: "chunk-009",
      nextChunkId: "chunk-011",
      order: 10
    }
  },
  
  // Chunk 11: Confidence Score Components
  {
    id: "chunk-011",
    connectorId: "notion-connector",
    content: "Confidence scores (0-100) evaluate information based on: 1) Information Quality: completeness, clarity, supporting examples; 2) Source Credibility: reputation, expertise, verification; 3) Usage Evidence: adoption metrics, implementation examples; and 4) Technical Accuracy: correctness, feasibility, security considerations.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:50:00Z",
    modified: "2025-03-15T15:20:00Z",
    processedAt: "2025-04-01T08:01:40Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["confidence scoring", "information quality", "source credibility"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Confidence Scoring"],
      previousChunkId: "chunk-010",
      nextChunkId: "chunk-012",
      order: 11
    }
  },
  
  // Chunk 12: Doubt Score Components
  {
    id: "chunk-012",
    connectorId: "notion-connector",
    content: "Doubt scores (0-100) evaluate information based on: 1) Deprecation Signals: warnings, replacement recommendations; 2) Incompleteness Indicators: missing information, undocumented edge cases; 3) Contradiction Detection: conflicting approaches, inconsistent usage; and 4) Obsolescence Risk: age, compatibility issues, newer alternatives.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T09:55:00Z",
    modified: "2025-03-15T15:25:00Z",
    processedAt: "2025-04-01T08:01:50Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["doubt scoring", "deprecation signals", "information reliability"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Confidence Scoring"],
      previousChunkId: "chunk-011",
      nextChunkId: "chunk-013",
      order: 12
    }
  },
  
  // Chunk 13: Contradiction Detection
  {
    id: "chunk-013",
    connectorId: "notion-connector",
    content: "Contradiction Detection in Memory Systems",
    contentType: ContentType.HEADING,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T10:00:00Z",
    modified: "2025-03-15T15:30:00Z",
    processedAt: "2025-04-01T08:02:00Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["contradiction detection", "information consistency", "memory systems"],
      tags: ["research", "framework", "core-concept"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Contradiction Detection"],
      previousChunkId: "chunk-012",
      nextChunkId: "chunk-014",
      order: 13
    }
  },
  
  // Chunk 14: Contradiction Detection Description
  {
    id: "chunk-014",
    connectorId: "notion-connector",
    content: "One of the most significant challenges in knowledge management is detecting and resolving contradictions. Human brains excel at identifying inconsistencies and reconciling conflicting information. Brain-inspired memory systems implement sophisticated contradiction detection algorithms that compare semantic meanings, context, and implications rather than just surface-level text matching.",
    contentType: ContentType.TEXT,
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T10:05:00Z",
    modified: "2025-03-15T15:35:00Z",
    processedAt: "2025-04-01T08:02:10Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["contradiction detection", "information consistency", "knowledge reconciliation"],
      tags: ["research", "framework"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Contradiction Detection"],
      previousChunkId: "chunk-013",
      nextChunkId: "chunk-015",
      order: 14
    }
  },
  
  // Chunk 15: Some Python code example about contradiction detection
  {
    id: "chunk-015",
    connectorId: "notion-connector",
    content: "```python\ndef detect_contradiction(statement1, statement2, threshold=0.8):\n    \"\"\"Detect if two statements contradict each other.\n    \n    Args:\n        statement1: First statement to compare\n        statement2: Second statement to compare\n        threshold: Similarity threshold for contradiction detection\n        \n    Returns:\n        Tuple of (contradiction_detected, confidence_score)\n    \"\"\"\n    # Generate embeddings for both statements\n    embedding1 = generate_embedding(statement1)\n    embedding2 = generate_embedding(statement2)\n    \n    # Calculate semantic similarity\n    similarity = cosine_similarity(embedding1, embedding2)\n    \n    # Extract key claims from each statement\n    claims1 = extract_claims(statement1)\n    claims2 = extract_claims(statement2)\n    \n    # Check for logical consistency between claims\n    consistency_score = evaluate_logical_consistency(claims1, claims2)\n    \n    # A high similarity with low consistency indicates contradiction\n    if similarity > threshold and consistency_score < 0.3:\n        return (True, consistency_score)\n    else:\n        return (False, consistency_score)\n```",
    contentType: ContentType.CODE,
    contentFormat: "python",
    source: {
      type: "notion",
      id: "page-123",
      url: "https://notion.so/workspace/page-123",
      container: "workspace-001",
      title: "Brain-Inspired AI Research"
    },
    created: "2025-03-01T10:10:00Z",
    modified: "2025-03-15T15:40:00Z",
    processedAt: "2025-04-01T08:02:20Z",
    author: {
      id: "user-001",
      name: "David Chen",
      email: "david.chen@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["contradiction detection", "code example", "implementation"],
      tags: ["research", "code", "implementation"],
      language: "en"
    },
    position: {
      documentId: "doc-123",
      path: ["Research", "Memory Systems", "Contradiction Detection"],
      previousChunkId: "chunk-014",
      order: 15
    }
  },
  
  // Additional chunks from a different source (GitHub) to demonstrate multi-source integration
  {
    id: "chunk-016",
    connectorId: "github-connector",
    content: "# Memory Transfer Mechanisms\n\nThis document outlines the mechanisms for transferring information between memory levels in a brain-inspired AI system.",
    contentType: ContentType.HEADING,
    source: {
      type: "github",
      id: "repo-123/file-456",
      url: "https://github.com/org/repo-123/blob/main/docs/memory-transfer.md",
      container: "repo-123",
      title: "Memory Transfer Mechanisms"
    },
    created: "2025-03-10T08:00:00Z",
    modified: "2025-03-20T11:30:00Z",
    processedAt: "2025-04-01T08:03:00Z",
    author: {
      id: "github-user-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["memory transfer", "memory levels", "cognitive architecture"],
      tags: ["documentation", "architecture"],
      language: "en"
    },
    position: {
      documentId: "file-456",
      path: ["docs", "memory-transfer.md"],
      nextChunkId: "chunk-017",
      order: 1
    },
    relationships: [
      {
        targetId: "repo-123/file-789",
        type: "references"
      }
    ]
  },
  
  // Chunk 17: Memory Transfer Introduction
  {
    id: "chunk-017",
    connectorId: "github-connector",
    content: "Memory transfer is a critical process in brain-inspired AI systems. Unlike traditional AI where all information exists in a single memory space, brain-inspired systems actively move information between different memory levels based on relevance, importance, and usage patterns. This document outlines the algorithms and mechanisms for these transfers.",
    contentType: ContentType.TEXT,
    source: {
      type: "github",
      id: "repo-123/file-456",
      url: "https://github.com/org/repo-123/blob/main/docs/memory-transfer.md",
      container: "repo-123",
      title: "Memory Transfer Mechanisms"
    },
    created: "2025-03-10T08:05:00Z",
    modified: "2025-03-20T11:35:00Z",
    processedAt: "2025-04-01T08:03:10Z",
    author: {
      id: "github-user-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["memory transfer", "information movement", "memory management"],
      tags: ["documentation", "architecture"],
      language: "en"
    },
    position: {
      documentId: "file-456",
      path: ["docs", "memory-transfer.md"],
      previousChunkId: "chunk-016",
      nextChunkId: "chunk-018",
      order: 2
    }
  },
  
  // Chunk 18: Contradicting information (for testing contradiction detection)
  {
    id: "chunk-018",
    connectorId: "github-connector",
    content: "The confidence scoring system assigns a single unified reliability score (0-100) to each piece of information, considering factors such as source credibility, content quality, and usage evidence. This creates a straightforward way to filter and prioritize knowledge.",
    contentType: ContentType.TEXT,
    source: {
      type: "github",
      id: "repo-123/file-456",
      url: "https://github.com/org/repo-123/blob/main/docs/memory-transfer.md",
      container: "repo-123",
      title: "Memory Transfer Mechanisms"
    },
    created: "2025-03-10T08:10:00Z",
    modified: "2025-03-20T11:40:00Z",
    processedAt: "2025-04-01T08:03:20Z",
    author: {
      id: "github-user-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com"
    },
    projectId: "brain-inspired-ai",
    context: {
      topics: ["confidence scoring", "information reliability", "knowledge filtering"],
      tags: ["documentation", "architecture"],
      language: "en"
    },
    position: {
      documentId: "file-456",
      path: ["docs", "memory-transfer.md"],
      previousChunkId: "chunk-017",
      order: 3
    }
  }
];

// Create chunk batches from the test data
export const dummyBatches: ChunkBatch[] = [
  // First batch: Notion chunks
  {
    batchId: "batch-001",
    connectorId: "notion-connector",
    sourceId: "page-123",
    projectId: "brain-inspired-ai",
    chunks: dummyChunks.slice(0, 15),
    batchMetadata: {
      totalChunks: 15,
      batchNumber: 1,
      isComplete: true
    }
  },
  
  // Second batch: GitHub chunks
  {
    batchId: "batch-002",
    connectorId: "github-connector",
    sourceId: "repo-123/file-456",
    projectId: "brain-inspired-ai",
    chunks: dummyChunks.slice(15, 18),
    batchMetadata: {
      totalChunks: 3,
      batchNumber: 1,
      isComplete: true
    }
  }
]; 