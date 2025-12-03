/**
 * Configuration Service Implementation
 * 
 * Centralized configuration management that implements IConfigurationService contract.
 * Handles environment variables, feature flags, and runtime configuration.
 */

import { IConfigurationService } from '../contracts';

interface Config {
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  
  // Feature Flags
  features: Record<string, boolean>;
  
  // UI Configuration
  theme: string;
  defaultLanguage: string;
  
  // Application Settings
  cacheTimeout: number;
  logLevel: string;
  enableAnalytics: boolean;
  
  // External Service URLs
  geminiApiKey?: string;
  openaiApiKey?: string;
}

export class ConfigurationService implements IConfigurationService {
  private config: Config;
  private featureFlags: Record<string, boolean>;

  constructor() {
    this.config = this.loadConfiguration();
    this.featureFlags = this.config.features;
  }

  get<T>(key: string, defaultValue?: T): T {
    const value = this.getNestedValue(this.config, key);
    return value !== undefined ? value : defaultValue!;
  }

  async set(key: string, value: any): Promise<void> {
    this.setNestedValue(this.config, key, value);
    
    // Persist to localStorage if possible
    try {
      const userConfig = JSON.parse(localStorage.getItem('user_config') || '{}');
      this.setNestedValue(userConfig, key, value);
      localStorage.setItem('user_config', JSON.stringify(userConfig));
    } catch (error) {
      console.warn('Failed to persist configuration:', error);
    }
  }

  getAll(): Record<string, any> {
    return { ...this.config };
  }

  isFeatureEnabled(feature: string): boolean {
    return this.featureFlags[feature] ?? false;
  }

  getFeatureFlags(): Record<string, boolean> {
    return { ...this.featureFlags };
  }

  async reload(): Promise<void> {
    this.config = this.loadConfiguration();
    this.featureFlags = this.config.features;
    console.log('Configuration reloaded');
  }

  private loadConfiguration(): Config {
    // Load base configuration from environment
    const baseConfig: Config = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
      apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
      
      features: {
        // Core Features
        enableAdvancedSearch: true,
        enableAIResearch: true,
        enableDocumentAnalysis: true,
        enableWorkflowAutomation: true,
        enableComplianceMonitoring: true,
        
        // Beta Features
        enablePacerIntegration: import.meta.env.VITE_ENABLE_PACER === 'true',
        enableAdvancedAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        enableExperimentalUI: import.meta.env.VITE_ENABLE_EXPERIMENTAL === 'true',
        
        // Enterprise Features
        enableAuditLogging: true,
        enableSSOIntegration: import.meta.env.VITE_ENABLE_SSO === 'true',
        enableAdvancedReporting: true,
      },
      
      theme: 'light',
      defaultLanguage: 'en',
      
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
      openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    };

    // Load user-specific configuration from localStorage
    try {
      const userConfig = JSON.parse(localStorage.getItem('user_config') || '{}');
      return this.mergeConfigs(baseConfig, userConfig);
    } catch (error) {
      console.warn('Failed to load user configuration:', error);
      return baseConfig;
    }
  }

  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  private setNestedValue(obj: any, key: string, value: any): void {
    const props = key.split('.');
    const lastProp = props.pop()!;
    
    const target = props.reduce((current, prop) => {
      if (!(prop in current)) {
        current[prop] = {};
      }
      return current[prop];
    }, obj);
    
    target[lastProp] = value;
  }

  private mergeConfigs(base: Config, override: Partial<Config>): Config {
    const merged = { ...base };
    
    for (const [key, value] of Object.entries(override)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        merged[key as keyof Config] = {
          ...merged[key as keyof Config],
          ...value
        };
      } else {
        merged[key as keyof Config] = value;
      }
    }
    
    return merged;
  }

  /**
   * Get environment-specific configuration
   */
  getEnvironment(): 'development' | 'staging' | 'production' {
    return (import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development') as any;
  }

  /**
   * Check if we're in development mode
   */
  isDevelopment(): boolean {
    return this.getEnvironment() === 'development';
  }

  /**
   * Check if we're in production mode
   */
  isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }
}