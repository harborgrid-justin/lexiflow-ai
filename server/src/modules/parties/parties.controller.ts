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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PartiesService } from './parties.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('parties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new party' })
  @ApiResponse({ status: 201, description: 'Party created successfully' })
  create(@Body() createPartyDto: CreatePartyDto) {
    return this.partiesService.create(createPartyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parties' })
  @ApiResponse({ status: 200, description: 'List of parties' })
  findAll(@Query('caseId') caseId?: string) {
    return this.partiesService.findAll(caseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get party by ID' })
  @ApiResponse({ status: 200, description: 'Party details' })
  findOne(@Param('id') id: string) {
    return this.partiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update party' })
  @ApiResponse({ status: 200, description: 'Party updated successfully' })
  update(@Param('id') id: string, @Body() updatePartyDto: UpdatePartyDto) {
    return this.partiesService.update(id, updatePartyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete party' })
  @ApiResponse({ status: 200, description: 'Party deleted successfully' })
  remove(@Param('id') id: string) {
    return this.partiesService.remove(id);
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'Get all parties for a case' })
  @ApiResponse({ status: 200, description: 'List of parties for the case' })
  findByCaseId(@Param('caseId') caseId: string) {
    return this.partiesService.findByCaseId(caseId);
  }

  @Delete('case/:caseId/user/:userId')
  @ApiOperation({ summary: 'Remove party from case' })
  @ApiResponse({ status: 200, description: 'Party removed from case successfully' })
  @ApiResponse({ status: 404, description: 'Party not found in case' })
  removeFromCase(
    @Param('caseId') caseId: string,
    @Param('userId') userId: string,
  ) {
    return this.partiesService.removeFromCase(caseId, userId);
  }
}