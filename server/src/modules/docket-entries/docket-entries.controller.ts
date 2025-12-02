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
import { DocketEntriesService } from './docket-entries.service';
import { CreateDocketEntryDto } from './dto/create-docket-entry.dto';
import { UpdateDocketEntryDto } from './dto/update-docket-entry.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('docket-entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('docket-entries')
export class DocketEntriesController {
  constructor(private readonly docketEntriesService: DocketEntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new docket entry' })
  create(@Body() createDocketEntryDto: CreateDocketEntryDto) {
    return this.docketEntriesService.create(createDocketEntryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all docket entries or filter by case' })
  findAll(@Query('case_id') caseId?: string) {
    return this.docketEntriesService.findAll(caseId);
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'Get all docket entries for a specific case' })
  findByCaseId(@Param('caseId') caseId: string) {
    return this.docketEntriesService.findByCaseId(caseId);
  }

  @Get('case/:caseId/type/:documentType')
  @ApiOperation({ summary: 'Get docket entries by document type for a case' })
  findByDocumentType(
    @Param('caseId') caseId: string,
    @Param('documentType') documentType: string,
  ) {
    return this.docketEntriesService.findByDocumentType(caseId, documentType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single docket entry by ID' })
  findOne(@Param('id') id: string) {
    return this.docketEntriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a docket entry' })
  update(
    @Param('id') id: string,
    @Body() updateDocketEntryDto: UpdateDocketEntryDto,
  ) {
    return this.docketEntriesService.update(id, updateDocketEntryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a docket entry' })
  remove(@Param('id') id: string) {
    return this.docketEntriesService.remove(id);
  }
}
