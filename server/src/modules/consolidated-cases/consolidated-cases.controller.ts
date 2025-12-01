import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsolidatedCasesService } from './consolidated-cases.service';
import { CreateConsolidatedCaseDto } from './dto/create-consolidated-case.dto';
import { UpdateConsolidatedCaseDto } from './dto/update-consolidated-case.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('consolidated-cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consolidated-cases')
export class ConsolidatedCasesController {
  constructor(private readonly consolidatedCasesService: ConsolidatedCasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new consolidated case relationship' })
  create(@Body() createConsolidatedCaseDto: CreateConsolidatedCaseDto) {
    return this.consolidatedCasesService.create(createConsolidatedCaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all consolidated cases or filter by case' })
  findAll(@Query('case_id') caseId?: string) {
    if (caseId) {
      return this.consolidatedCasesService.findByCaseId(caseId);
    }
    return this.consolidatedCasesService.findAll();
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'Get all consolidated case relationships for a specific case' })
  findByCaseId(@Param('caseId') caseId: string) {
    return this.consolidatedCasesService.findByCaseId(caseId);
  }

  @Get('case/:caseId/lead')
  @ApiOperation({ summary: 'Get lead cases where this case is a member' })
  findLeadCases(@Param('caseId') caseId: string) {
    return this.consolidatedCasesService.findLeadCases(caseId);
  }

  @Get('case/:caseId/members')
  @ApiOperation({ summary: 'Get member cases where this case is the lead' })
  findMemberCases(@Param('caseId') caseId: string) {
    return this.consolidatedCasesService.findMemberCases(caseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single consolidated case relationship by ID' })
  findOne(@Param('id') id: string) {
    return this.consolidatedCasesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a consolidated case relationship' })
  update(
    @Param('id') id: string,
    @Body() updateConsolidatedCaseDto: UpdateConsolidatedCaseDto,
  ) {
    return this.consolidatedCasesService.update(id, updateConsolidatedCaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a consolidated case relationship' })
  remove(@Param('id') id: string) {
    return this.consolidatedCasesService.remove(id);
  }
}
