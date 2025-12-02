import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Authentication Guard
 *
 * Protects routes that require local authentication (email/password).
 * Extends Passport's AuthGuard to use the 'local' strategy.
 *
 * @class LocalAuthGuard
 * @extends AuthGuard('local')
 *
 * @security
 * - Triggers LocalStrategy validation
 * - Handles authentication errors
 * - Attaches user object to request on success
 *
 * @example
 * @Post('login')
 * @UseGuards(LocalAuthGuard)
 * async login(@Request() req) {
 *   return this.authService.login(req.user);
 * }
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /**
   * Handles authentication request processing
   *
   * Processes the result of the local strategy validation.
   * Throws appropriate errors for authentication failures.
   *
   * @param {unknown} err - Error from strategy, if any
   * @param {unknown} user - User object returned by strategy
   * @param {unknown} info - Additional info from strategy
   * @param {ExecutionContext} context - Execution context
   * @param {unknown} status - HTTP status
   * @returns {TUser} Validated user object
   *
   * @throws {UnauthorizedException} When authentication fails
   */
  handleRequest<TUser = unknown>(
    err: unknown,
    user: unknown,
    _info: unknown,
    _context: ExecutionContext,
    _status?: unknown,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid credentials');
    }
    return user as TUser;
  }
}
