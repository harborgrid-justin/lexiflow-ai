import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../models/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

/**
 * Authentication Module
 *
 * Provides complete authentication and authorization infrastructure for LexiFlow AI.
 * Implements JWT-based authentication with Passport strategies for both local
 * (email/password) and JWT token validation.
 *
 * @module AuthModule
 *
 * @features
 * - User registration with email and password
 * - Login with email/password authentication
 * - JWT token generation and validation
 * - Password hashing with bcrypt
 * - Current user profile retrieval
 * - Logout endpoint
 * - Public route decorator for bypassing authentication
 *
 * @security
 * - JWT tokens expire in 24 hours
 * - Passwords hashed with bcrypt (configurable rounds)
 * - Token includes user ID, email, organization_id, and role
 * - Guards protect routes requiring authentication
 *
 * @exports
 * - AuthService - for other modules to use authentication logic
 * - JwtAuthGuard - for protecting routes with JWT authentication
 * - LocalAuthGuard - for local email/password authentication
 *
 * @example
 * // Import in another module
 * @Module({
 *   imports: [AuthModule],
 *   ...
 * })
 */
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRY') || '24h';
        return {
          secret: configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtAuthGuard, LocalAuthGuard],
  exports: [AuthService, JwtAuthGuard, LocalAuthGuard],
})
export class AuthModule {}