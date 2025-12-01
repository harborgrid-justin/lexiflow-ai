import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../models/user.model';

/**
 * User Response DTO - represents what the API returns
 * Excludes sensitive fields like password_hash
 */
export class UserResponseDto {
  @ApiProperty({ example: 'user-123' })
  id: string;

  @ApiProperty({ example: 'John' })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@lawfirm.com' })
  email: string;

  @ApiProperty({ example: 'Attorney' })
  role: string;

  @ApiPropertyOptional({ example: 'Partner' })
  position?: string;

  @ApiPropertyOptional({ example: 'California' })
  bar_admission?: string;

  @ApiPropertyOptional({ example: '123456' })
  bar_number?: string;

  @ApiPropertyOptional({ example: '+1-555-0123' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Corporate law, M&A' })
  expertise?: string;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: 'org-123' })
  organization_id: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: Date;

  /**
   * Create DTO from User model, excluding password_hash
   */
  static fromModel(user: User): UserResponseDto {
    const { password_hash, ...userData } = user.toJSON();
    return userData as UserResponseDto;
  }

  /**
   * Create DTOs from User model array
   */
  static fromModels(users: User[]): UserResponseDto[] {
    return users.map(user => UserResponseDto.fromModel(user));
  }
}
