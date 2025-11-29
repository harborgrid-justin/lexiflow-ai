import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.model';
import { User } from './user.model';
import { Case } from './case.model';

@Table({
  tableName: 'calendar_events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['case_id'],
      name: 'idx_calendar_events_case_id'
    },
    {
      fields: ['organizer_id'],
      name: 'idx_calendar_events_organizer_id'
    },
    {
      fields: ['start_time'],
      name: 'idx_calendar_events_start_time'
    },
    {
      fields: ['type'],
      name: 'idx_calendar_events_type'
    },
    {
      fields: ['status'],
      name: 'idx_calendar_events_status'
    },
    {
      fields: ['start_time', 'end_time'],
      name: 'idx_calendar_events_time_range'
    }
  ]
})
export class CalendarEvent extends Model {
  @ApiProperty({ example: 'cal-123', description: 'Unique calendar event ID' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({ example: 'Case Smith vs Jones - Hearing', description: 'Event title' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'hearing', description: 'Event type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'Motion hearing for preliminary injunction', description: 'Event description' })
  @Column(DataType.TEXT)
  description?: string;

  @ApiProperty({ example: '2024-02-15T14:00:00Z', description: 'Event start time' })
  @Column({ type: DataType.DATE, allowNull: false })
  start_time: Date;

  @ApiProperty({ example: '2024-02-15T16:00:00Z', description: 'Event end time' })
  @Column({ type: DataType.DATE, allowNull: false })
  end_time: Date;

  @ApiProperty({ example: 'US District Court, Room 201', description: 'Event location' })
  @Column(DataType.STRING)
  location?: string;

  @ApiProperty({ example: 'scheduled', description: 'Event status' })
  @Default('scheduled')
  @Column(DataType.STRING)
  status: string;

  @ApiProperty({ example: 'high', description: 'Event priority' })
  @Default('medium')
  @Column(DataType.STRING)
  priority: string;

  @ApiProperty({ example: false, description: 'All-day event flag' })
  @Default(false)
  @Column(DataType.BOOLEAN)
  all_day: boolean;

  @ApiProperty({ example: '30m', description: 'Reminder time before event' })
  @Column(DataType.STRING)
  reminder?: string;

  @ApiProperty({ example: 'Hon. Jane Smith presiding', description: 'Event notes' })
  @Column(DataType.TEXT)
  notes?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @ForeignKey(() => Case)
  @Column(DataType.UUID)
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Event organizer ID' })
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  organizer_id?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID' })
  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  owner_org_id?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Creation timestamp' })
  @Column(DataType.DATE)
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Last update timestamp' })
  @Column(DataType.DATE)
  updated_at: Date;

  @BelongsTo(() => Case, 'case_id')
  case?: Case;

  @BelongsTo(() => User, 'organizer_id')
  organizer?: User;

  @BelongsTo(() => Organization, 'owner_org_id')
  organization?: Organization;
}