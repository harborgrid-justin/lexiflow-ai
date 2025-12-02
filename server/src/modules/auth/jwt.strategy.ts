import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';

/**
 * JWT Authentication Strategy
 *
 * Implements Passport's JWT strategy for validating JSON Web Tokens.
 * Extracts JWT from the Authorization header and validates the token signature.
 * Retrieves the complete user object from the database for each request.
 *
 * @class JwtStrategy
 * @extends PassportStrategy(Strategy)
 *
 * @security
 * - Validates JWT signature using secret from environment
 * - Checks token expiration (24 hours default)
 * - Fetches fresh user data from database on each request
 * - Throws UnauthorizedException if user not found
 *
 * @example
 * // Automatically invoked by JwtAuthGuard
 * // On routes protected with @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy
   *
   * @param {ConfigService} configService - Configuration service for JWT secret
   * @param {typeof User} userModel - Sequelize User model for database queries
   */
  constructor(
    private configService: ConfigService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
    });
  }

  /**
   * Validates JWT payload and returns user object
   *
   * Called automatically by Passport after JWT signature validation.
   * Fetches the complete user object from the database using the user ID from the token.
   * This ensures the user still exists and has current data.
   *
   * @param {Object} payload - Decoded JWT payload
   * @param {string} payload.sub - User ID (subject)
   * @param {string} payload.email - User email
   * @param {string} payload.organization_id - Organization ID
   * @param {string} payload.role - User role
   * @returns {Promise<Object>} User object with userId, email, organization_id, and role
   *
   * @throws {UnauthorizedException} When user is not found in database
   *
   * @example
   * // Payload structure:
   * // { sub: "user-uuid", email: "user@firm.com", organization_id: "org-uuid", role: "Attorney" }
   * const user = await validate(payload);
   * // Returns: { userId: "user-uuid", email: "user@firm.com", ... }
   */
  async validate(payload: {
    sub: string;
    email: string;
    organization_id: string;
    role: string;
  }) {
    // Fetch user from database to ensure they still exist and get fresh data
    const user = await this.userModel.findByPk(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }

    // Return user data that will be attached to request.user
    return {
      userId: user.id,
      email: user.email,
      organization_id: user.organization_id,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }
}