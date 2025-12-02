import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from '../../models/user.model';

/**
 * Local Authentication Strategy
 *
 * Implements Passport's local strategy for username/password authentication.
 * Validates user credentials during the login process.
 *
 * @class LocalStrategy
 * @extends PassportStrategy(Strategy)
 *
 * @security
 * - Uses email as username field
 * - Delegates credential validation to AuthService
 * - Returns user object on successful authentication
 *
 * @example
 * // Automatically invoked by LocalAuthGuard
 * // On POST /auth/login with { email, password }
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of LocalStrategy
   *
   * @param {AuthService} authService - Service for validating user credentials
   */
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Use 'email' instead of default 'username'
      passwordField: 'password',
    });
  }

  /**
   * Validates user credentials
   *
   * Called automatically by Passport during authentication.
   * Verifies email and password combination.
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password (plain text)
   * @returns {Promise<User>} Validated user object
   *
   * @throws {UnauthorizedException} When credentials are invalid
   *
   * @example
   * const user = await validate("attorney@firm.com", "password123");
   */
  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
