import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';

/**
 * Authentication Controller
 * 
 * Handles user authentication, registration, and session management.
 * Provides endpoints for login, registration, and retrieving current user information.
 * 
 * @class AuthController
 * @implements JWT-based authentication
 * 
 * @example
 * // Login request
 * POST /api/v1/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * @example
 * // Get current user
 * GET /api/v1/auth/me
 * Headers: { Authorization: 'Bearer <token>' }
 */
@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController
   * @param {AuthService} authService - The authentication service for handling auth logic
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * User login endpoint
   *
   * Authenticates a user with email and password credentials using Passport Local Strategy.
   * Returns a JWT access token and user information upon successful authentication.
   *
   * @param {Request} req - Express request object with validated user
   * @returns {Promise<{access_token: string, user: Object}>} JWT token and user data
   *
   * @throws {UnauthorizedException} When credentials are invalid
   *
   * @example
   * POST /auth/login
   * {
   *   "email": "attorney@firm.com",
   *   "password": "SecurePassword123!"
   * }
   * // Returns: { access_token: "eyJhbGc...", user: {...} }
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req: any) {
    // User is already validated by LocalAuthGuard (local.strategy.ts)
    // Just need to generate and return JWT token
    return this.authService.generateTokens(req.user);
  }

  /**
   * User registration endpoint
   *
   * Creates a new user account with the provided information.
   * Validates email uniqueness and password strength before creating the account.
   * Password is hashed using bcrypt before storage.
   *
   * @param {RegisterDto} registerDto - Registration data including email, password, name, etc.
   * @returns {Promise<Object>} Created user object (excluding password hash)
   *
   * @throws {ConflictException} When a user with the same email already exists
   * @throws {BadRequestException} When validation fails
   *
   * @example
   * POST /auth/register
   * {
   *   "email": "newattorney@firm.com",
   *   "password": "SecurePass123!",
   *   "first_name": "John",
   *   "last_name": "Doe",
   *   "organization_id": "org-uuid"
   * }
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    const { password_hash, ...result } = user.toJSON();
    return result;
  }

  /**
   * Get current authenticated user profile
   *
   * Retrieves the complete profile of the currently authenticated user.
   * Requires a valid JWT token in the Authorization header.
   * Password hash is excluded from the response for security.
   *
   * @param {Request} req - Express request object containing JWT user data
   * @returns {Promise<Object>} Current user profile (excluding password hash)
   *
   * @throws {UnauthorizedException} When JWT token is invalid or missing
   * @throws {NotFoundException} When user no longer exists
   *
   * @example
   * GET /auth/me
   * Headers: { Authorization: 'Bearer eyJhbGc...' }
   * // Returns: { id: "uuid", email: "user@firm.com", role: "Partner", ... }
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  async getCurrentUser(@Request() req: any) {
    const user = await this.authService.getCurrentUser(req.user.userId);
    const { password_hash, ...result } = user.toJSON();
    return result;
  }

  /**
   * User logout endpoint
   *
   * Handles user logout. Since JWT is stateless, the actual token invalidation
   * happens on the client side by removing the token from storage.
   * This endpoint is provided for consistency and can be extended with
   * token blacklisting or session management if needed.
   *
   * @returns {Promise<Object>} Logout success message
   *
   * @example
   * POST /auth/logout
   * Headers: { Authorization: 'Bearer eyJhbGc...' }
   * // Returns: { message: "Logged out successfully" }
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout (client-side token removal)' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  async logout() {
    // JWT is stateless, so logout is handled client-side by removing the token
    // This endpoint can be extended with token blacklisting via Redis if needed
    return {
      message: 'Logged out successfully',
      note: 'Please remove the JWT token from client storage',
    };
  }
}