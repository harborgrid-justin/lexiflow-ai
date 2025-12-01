import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';
import { Case } from './case.model';

@Table({
  tableName: 'conversations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_conversations_case_id',
    },
    {
      fields: ['created_by'],
      name: 'idx_conversations_created_by',
    },
    {
      fields: ['status'],
      name: 'idx_conversations_status',
    },
  ],
})
export class Conversation extends Model {
  @ApiProperty({ example: 'conv-123', description: 'Unique conversation ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Case Discussion - Smith v. Jones', description: 'Conversation title' })
  @Column(DataType.STRING)
  title: string;

  @ApiProperty({ example: 'case', description: 'Type of conversation' })
  @Column(DataType.STRING)
  type: string;

  @ApiProperty({ example: 'case-123', description: 'Related case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Conversation creator ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  created_by: string;

  @ApiProperty({ example: 'active', description: 'Conversation status' })
  @Default('active')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: ['user-123', 'user-456'], description: 'List of participant user IDs' })
  @Column(DataType.JSON)
  participants: string[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last message timestamp' })
  @Column(DataType.DATE)
  last_message_at?: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case)
  case?: Case;

  @BelongsTo(() => User, 'created_by')
  creator?: User;

  @HasMany(() => Message)
  messages?: Message[];
}

@Table({
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['conversation_id'],
      name: 'idx_messages_conversation_id',
    },
    {
      fields: ['sender_id'],
      name: 'idx_messages_sender_id',
    },
    {
      fields: ['created_at'],
      name: 'idx_messages_created_at',
    },
    {
      fields: ['message_type'],
      name: 'idx_messages_type',
    },
  ],
})
export class Message extends Model {
  @ApiProperty({ example: 'msg-123', description: 'Unique message ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'conv-123', description: 'Conversation ID' })
  @ForeignKey(() => Conversation)
  @Column(DataType.UUID)
  conversation_id: string;

  @ApiProperty({ example: 'user-123', description: 'Message sender ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  sender_id: string;

  @ApiProperty({ example: 'Hello, can we discuss the Smith case?', description: 'Message content' })
  @Column(DataType.TEXT)
  content: string;

  @ApiProperty({ example: 'text', description: 'Message type' })
  @Default('text')
  @Column(DataType.STRING)
  message_type: string;

  @ApiProperty({ example: ['doc-123'], description: 'Attached document IDs' })
  @Column(DataType.JSON)
  attachments?: string[];

  @ApiProperty({ example: 'sent', description: 'Message status' })
  @Default('sent')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Conversation)
  conversation?: Conversation;

  @BelongsTo(() => User, 'sender_id')
  sender?: User;
}