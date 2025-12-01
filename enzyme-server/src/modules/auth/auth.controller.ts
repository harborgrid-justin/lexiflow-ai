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
   * Authenticates a user with email and password credentials.
   * Returns a JWT access token and user information upon successful authentication.
   * 
   * @param {LoginDto} loginDto - Login credentials containing email and password
   * @returns {Promise<{access_token: string, user: Object}>} JWT token and user data
   * 
   * @throws {UnauthorizedException} When credentials are invalid
   * 
   * @example
   * const response = await login({
   *   email: "attorney@firm.com",
   *   password: "SecurePassword123!"
   * });
   * // Returns: { access_token: "eyJhbGc...", user: {...} }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
   * const newUser = await register({
   *   email: "newattorney@firm.com",
   *   password: "SecurePass123!",
   *   first_name: "John",
   *   last_name: "Doe",
   *   role: "Associate"
   * });
   */
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
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
   * // With Authorization header: "Bearer eyJhbGc..."
   * const currentUser = await getCurrentUser(req);
   * // Returns: { id: "uuid", email: "user@firm.com", role: "Partner", ... }
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Request() req: any) {
    const user = await this.authService.getCurrentUser(req.user.userId);
    const { password_hash, ...result } = user.toJSON();
    return result;
  }
}