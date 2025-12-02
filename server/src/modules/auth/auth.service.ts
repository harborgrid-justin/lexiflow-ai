import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.model';
import { LoginDto, RegisterDto } from './dto';

/**
 * Authentication Service
 * 
 * Provides core authentication functionality including user validation,
 * JWT token generation, user registration, and password management.
 * Implements secure password hashing using bcrypt.
 * 
 * @class AuthService
 * @implements User authentication and session management
 * 
 * @security
 * - Passwords are hashed with bcrypt (configurable rounds, default 10)
 * - JWT tokens include user ID, email, organization_id, and role
 * - JWT tokens expire in 24 hours (1 day)
 * - Email uniqueness is enforced at database level
 * 
 * @example
 * const authService = new AuthService(userModel, jwtService);
 * const result = await authService.login({ email, password });
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService
   *
   * @param {typeof User} userModel - Sequelize User model for database operations
   * @param {JwtService} jwtService - NestJS JWT service for token operations
   * @param {ConfigService} configService - Configuration service for environment variables
   */
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Validates user credentials
   * 
   * Verifies email and password combination against the database.
   * Uses bcrypt to securely compare the provided password with the stored hash.
   * 
   * @param {string} email - User's email address
   * @param {string} password - Plain text password to validate
   * @returns {Promise<User | null>} User object if valid, null otherwise
   * 
   * @private
   * @security Password is never logged or exposed
   * 
   * @example
   * const user = await this.validateUser("user@firm.com", "password123");
   * if (user) {
   *   // User is authenticated
   * }
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    console.log('Validating user with email:', email);
    
    try {
      const user = await this.userModel.findOne({ where: { email } });
      console.log('Found user:', user ? 'Yes' : 'No');
      
      if (user && await bcrypt.compare(password, user.password_hash)) {
        console.log('Password valid for user:', user.email);
        return user;
      }
      
      console.log('User validation failed');
      return null;
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }
  }

  /**
   * Generates JWT token from user object
   *
   * Creates a signed JWT token containing user identification and authorization data.
   * Used after successful authentication to provide access credentials.
   *
   * @param {User} user - Authenticated user object
   * @returns {{ access_token: string, user: Object }} JWT token and user data
   *
   * @example
   * const tokens = this.generateTokens(user);
   * // Returns: { access_token: "eyJhbGc...", user: {...} }
   */
  generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      organization_id: user.organization_id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        organization_id: user.organization_id,
      },
    };
  }

  /**
   * Authenticates user and generates JWT token
   *
   * Validates credentials and generates a signed JWT access token.
   * The token includes user ID, email, organization ID, and role in the payload.
   *
   * @param {LoginDto} loginDto - Login credentials (email and password)
   * @returns {Promise<{access_token: string, user: Object}>} JWT token and user data
   *
   * @throws {UnauthorizedException} When credentials are invalid
   *
   * @example
   * const result = await authService.login({
   *   email: "attorney@firm.com",
   *   password: "SecurePass123!"
   * });
   * // Returns:
   * // {
   * //   access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   * //   user: { id, email, first_name, last_name, role, organization_id }
   * // }
   */
  async login(loginDto: LoginDto) {
    console.log('Login attempt with:', loginDto);
    const user = await this.validateUser(loginDto.email, loginDto.password);

    console.log('Validated user:', user ? `User ID: ${user.id}` : 'null');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  /**
   * Registers a new user account
   * 
   * Creates a new user in the system with hashed password and default settings.
   * Validates that the email is unique before creating the account.
   * Password is hashed using bcrypt with 10 salt rounds.
   * 
   * @param {RegisterDto} registerDto - User registration data
   * @returns {Promise<User>} Newly created user object
   * 
   * @throws {ConflictException} When email already exists
   * 
   * @security
   * - Password is hashed before storage (10 rounds)
   * - Default role is 'user' for security
   * - Email uniqueness is enforced
   * 
   * @example
   * const newUser = await authService.register({
   *   email: "newattorney@firm.com",
   *   password: "SecurePass123!",
   *   first_name: "John",
   *   last_name: "Doe",
   *   organization_id: "org-uuid"
   * });
   */
  async register(registerDto: RegisterDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Get bcrypt rounds from environment, default to 10
    const saltRounds = this.configService.get<number>('BCRYPT_ROUNDS') || 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Auto-generate name from first and last name
    const name = `${registerDto.first_name} ${registerDto.last_name}`;

    return this.userModel.create({
      ...registerDto,
      name,
      password_hash: hashedPassword,
      role: 'user', // Default role for new registrations
    });
  }

  /**
   * Retrieves current user by ID
   * 
   * Fetches the complete user profile from the database using the user ID.
   * Typically used after JWT token validation to get fresh user data.
   * 
   * @param {string} userId - UUID of the user
   * @returns {Promise<User>} Complete user object
   * 
   * @throws {UnauthorizedException} When user is not found
   * 
   * @example
   * const user = await authService.getCurrentUser("uuid-here");
   * console.log(user.email, user.role);
   */
  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}