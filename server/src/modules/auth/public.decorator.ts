import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for marking routes as public
 *
 * Used by JwtAuthGuard to identify routes that should bypass authentication.
 *
 * @constant
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public Route Decorator
 *
 * Marks a route or controller as publicly accessible, bypassing JWT authentication.
 * Use this decorator on endpoints that don't require user authentication.
 *
 * @decorator
 *
 * @security
 * - Routes marked with @Public() bypass JwtAuthGuard
 * - Use sparingly and only for truly public endpoints
 * - Common use cases: login, register, health checks, public documentation
 *
 * @example
 * // Mark a single route as public
 * @Public()
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 *
 * @example
 * // Mark entire controller as public
 * @Public()
 * @Controller('health')
 * export class HealthController {
 *   @Get()
 *   check() {
 *     return { status: 'ok' };
 *   }
 * }
 *
 * @example
 * // Use with JwtAuthGuard
 * @Injectable()
 * export class JwtAuthGuard extends AuthGuard('jwt') {
 *   canActivate(context: ExecutionContext) {
 *     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
 *       context.getHandler(),
 *       context.getClass(),
 *     ]);
 *     if (isPublic) {
 *       return true; // Skip authentication
 *     }
 *     return super.canActivate(context);
 *   }
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
