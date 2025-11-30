import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { CreateAuditLogEntryDto } from './dto/create-audit-log-entry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOperation({ summary: 'Log an audit entry' })
  @ApiResponse({ status: 201, description: 'Audit entry logged successfully' })
  logAction(@Body() createAuditLogEntryDto: CreateAuditLogEntryDto) {
    return this.auditService.logAction(createAuditLogEntryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get audit log entries' })
  @ApiResponse({ status: 200, description: 'List of audit log entries' })
  findAll(
    @Query('userId') userId?: string,
    @Query('resource') resource?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.auditService.findAll(userId, resource, startDate, endDate, limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit entry by ID' })
  @ApiResponse({ status: 200, description: 'Audit entry details' })
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get audit entries for user' })
  @ApiResponse({ status: 200, description: 'User audit entries' })
  findByUser(@Param('userId') userId: string, @Query('limit') limit?: number) {
    return this.auditService.findByUser(userId, limit);
  }

  @Get('resource/:resource')
  @ApiOperation({ summary: 'Get audit entries for resource' })
  @ApiResponse({ status: 200, description: 'Resource audit entries' })
  findByResource(
    @Param('resource') resource: string,
    @Query('resourceId') resourceId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.findByResource(resource, resourceId, limit);
  }
}