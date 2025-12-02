/**
 * LexiFlow AI Client - Main Entry Point
 *
 * This is the main entry point for the LexiFlow AI frontend application.
 * It exports all public APIs organized by the SOA architecture.
 */

// Core Application
export { default as App } from './App';

// Feature Modules (SOA Architecture)
export * as features from './features';

// Shared Module (Cross-cutting concerns)
export * as shared from './shared';

// Legacy Components (for backward compatibility)
export * as components from './components';

// Core Infrastructure
export * as core from './core';

// Services
export * as services from './services';

// Types (Domain types)
export * from './types';

// Utils
export * from './utils';

// Constants
export * from './constants';

// Contexts
export * from './contexts';

// Stores
export * from './store';