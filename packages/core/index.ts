/**
 * CollabSphere AI Core Package
 * 
 * This package provides shared types, utilities, and constants used
 * across the CollabSphere AI system. It serves as the foundation for
 * communication between different components.
 */

// Export all type definitions
export * from './types/connectors';
export * from './types/memory';
export * from './types/api';

// Common constants for the entire system
export const SYSTEM_VERSION = '0.1.0';
export const DEFAULT_CONFIDENCE_THRESHOLD = 70;
export const DEFAULT_DOUBT_THRESHOLD = 30;

// Memory level weights for scoring
export const MEMORY_LEVEL_WEIGHTS = {
  sensory: 0.5,
  working: 0.7,
  semantic: 1.0,
  episodic: 0.8,
  procedural: 0.9
};

// Confidence classifications
export const CONFIDENCE_CLASSIFICATIONS = {
  HIGH: 80,   // 80-100
  MEDIUM: 50, // 50-79
  LOW: 0      // 0-49
};

// Standard content types supported
export const CONTENT_TYPES = [
  'text',
  'code',
  'image',
  'table',
  'list',
  'other'
];

// Standard relationship types
export const RELATIONSHIP_TYPES = [
  'contains',
  'references',
  'extends',
  'contradicts',
  'supersedes',
  'examples',
  'implements',
  'related'
];

// Common utility for generating ISO timestamps
export const timestamp = (): string => new Date().toISOString();

// Common UUID generator (placeholder - would use proper UUID library)
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}; 