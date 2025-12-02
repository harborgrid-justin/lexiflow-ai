/**
 * Authentication Module Exports
 *
 * Central export file for the authentication module.
 * Provides easy access to all authentication components.
 *
 * @module auth
 */

// Module
export * from './auth.module';

// Service
export * from './auth.service';

// Controller
export * from './auth.controller';

// Strategies
export * from './jwt.strategy';
export * from './local.strategy';

// Guards
export * from './jwt-auth.guard';
export * from './local-auth.guard';

// Decorators
export * from './current-user.decorator';
export * from './public.decorator';

// DTOs
export * from './dto';
