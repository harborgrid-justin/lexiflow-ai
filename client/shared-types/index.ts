/**
 * Shared Types for LexiFlow AI
 * This file re-exports all API contracts between frontend and backend
 *
 * IMPORTANT: Backend uses snake_case for database fields
 * Frontend may use camelCase for component props
 * These types document the actual API response format
 */

// Export enums and type aliases
export * from './enums';

// Export entity types
export * from './core-entities';
export * from './document-entities';
export * from './workflow-entities';
export * from './litigation-entities';
export * from './messaging-entities';
