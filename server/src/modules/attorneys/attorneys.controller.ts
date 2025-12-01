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
import { AttorneysService } from './attorneys.service';
import { CreateAttorneyDto } from './dto/create-attorney.dto';
import { UpdateAttorneyDto } from './dto/update-attorney.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('attorneys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attorneys')
export class AttorneysController {
  constructor(private readonly attorneysService: AttorneysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attorney' })
  create(@Body() createAttorneyDto: CreateAttorneyDto) {
    return this.attorneysService.create(createAttorneyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attorneys or filter by party' })
  findAll(@Query('party_id') partyId?: string, @Query('status') status?: string) {
    if (partyId) {
      return this.attorneysService.findByPartyId(partyId);
    }
    if (status === 'active') {
      return this.attorneysService.findActive();
    }
    return this.attorneysService.findAll();
  }

  @Get('party/:partyId')
  @ApiOperation({ summary: 'Get all attorneys for a specific party' })
  findByPartyId(@Param('partyId') partyId: string) {
    return this.attorneysService.findByPartyId(partyId);
  }

  @Get('firm/:firm')
  @ApiOperation({ summary: 'Search attorneys by firm name' })
  findByFirm(@Param('firm') firm: string) {
    return this.attorneysService.findByFirm(firm);
  }

  @Get('bar/:barNumber')
  @ApiOperation({ summary: 'Find attorney by bar number' })
  findByBarNumber(@Param('barNumber') barNumber: string) {
    return this.attorneysService.findByBarNumber(barNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single attorney by ID' })
  findOne(@Param('id') id: string) {
    return this.attorneysService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attorney' })
  update(
    @Param('id') id: string,
    @Body() updateAttorneyDto: UpdateAttorneyDto,
  ) {
    return this.attorneysService.update(id, updateAttorneyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attorney' })
  remove(@Param('id') id: string) {
    return this.attorneysService.remove(id);
  }
}
