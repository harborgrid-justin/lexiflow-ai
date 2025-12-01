import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Health Check Controller
 * 
 * Provides endpoints for monitoring application health and readiness
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * Health check endpoint
   * 
   * Returns the current health status of the application
   * 
   * @returns {object} Health status
   */
  @Get()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  check() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  /**
   * Readiness check endpoint
   * 
   * Checks if the application is ready to accept requests
   */
  @Get('ready')
  @ApiOperation({ summary: 'Check application readiness' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Liveness check endpoint
   * 
   * Checks if the application is alive (used by orchestrators like Kubernetes)
   */
  @Get('live')
  @ApiOperation({ summary: 'Check application liveness' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
