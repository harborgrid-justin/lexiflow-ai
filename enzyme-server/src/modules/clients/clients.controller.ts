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
import { ClientsService } from './clients.service';
import { Client } from '../../models/client.model';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully', type: Client })
  create(@Body() createClientData: Partial<Client>): Promise<Client> {
    return this.clientsService.create(createClientData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Organization ID filter' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully', type: [Client] })
  findAll(@Query('orgId') orgId?: string): Promise<Client[]> {
    return this.clientsService.findAll(orgId);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get clients by name' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully', type: [Client] })
  findByName(@Param('name') name: string): Promise<Client[]> {
    return this.clientsService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully', type: Client })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Client>,
  ): Promise<Client> {
    return this.clientsService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(id);
  }
}