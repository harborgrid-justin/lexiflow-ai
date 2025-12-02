import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EvidenceService } from './evidence.service';
import { Evidence } from '../../models/evidence.model';
import { ChainOfCustodyEvent } from '../../models/chain-of-custody-event.model';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { CreateChainOfCustodyEventDto } from './dto/create-chain-of-custody-event.dto';

@ApiTags('evidence')
@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new evidence record' })
  @ApiResponse({ status: 201, description: 'Evidence created successfully', type: Evidence })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createEvidenceDto: CreateEvidenceDto): Promise<Evidence> {
    return this.evidenceService.create(createEvidenceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all evidence records' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiResponse({ status: 200, description: 'Evidence retrieved successfully', type: [Evidence] })
  findAll(@Query('caseId') caseId?: string): Promise<Evidence[]> {
    return this.evidenceService.findAll(caseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evidence by ID' })
  @ApiResponse({ status: 200, description: 'Evidence retrieved successfully', type: Evidence })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  findOne(@Param('id') id: string): Promise<Evidence> {
    return this.evidenceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update evidence' })
  @ApiResponse({ status: 200, description: 'Evidence updated successfully', type: Evidence })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string,
    @Body() updateEvidenceDto: UpdateEvidenceDto,
  ): Promise<Evidence> {
    return this.evidenceService.update(id, updateEvidenceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete evidence' })
  @ApiResponse({ status: 200, description: 'Evidence deleted successfully' })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.evidenceService.remove(id);
  }

  @Post(':id/custody')
  @ApiOperation({ summary: 'Add chain of custody event to evidence' })
  @ApiResponse({ status: 201, description: 'Chain of custody event created successfully', type: ChainOfCustodyEvent })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  addChainOfCustodyEvent(
    @Param('id') evidenceId: string,
    @Body() createEventDto: CreateChainOfCustodyEventDto,
  ): Promise<ChainOfCustodyEvent> {
    return this.evidenceService.addChainOfCustodyEvent(evidenceId, createEventDto);
  }
}