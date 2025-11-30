import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.model';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

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

  async login(loginDto: LoginDto) {
    console.log('Login attempt with:', loginDto);
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    console.log('Validated user:', user ? `User ID: ${user.id}` : 'null');
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      orgId: user.organization_id, 
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

  async register(registerDto: RegisterDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return this.userModel.create({
      ...registerDto,
      password_hash: hashedPassword,
    });
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}