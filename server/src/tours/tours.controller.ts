import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/user.schema';
import { Tour } from './tour.schema';
import { ToursService } from './tours.service';

@Controller('tours')
@UseGuards(AuthenticatedGuard)
@ApiTags('Tours')
export class ToursController {
  constructor(private toursService: ToursService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tours',
    description: 'Get all tours',
  })
  @ApiResponse({ status: 200, type: [Tour] })
  async findAll(@Req() req): Promise<Tour[]> {
    const user = req.user as User;
    return this.toursService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one tour',
    description: 'Get one tour',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiResponse({ status: 200, type: Tour })
  async findOne(@Param() id: string): Promise<Tour> {
    return this.toursService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create tour',
    description: 'Create tour',
  })
  @ApiBody({ type: Tour })
  @ApiResponse({ status: 201, type: Tour })
  async create(@Req() req, @Body() tour: Tour): Promise<Tour> {
    const user = req.user as User;
    tour.user = user;
    return this.toursService.create(tour);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update tour',
    description: 'Update tour',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiBody({ type: Tour })
  @ApiResponse({ status: 200, type: Tour })
  async update(@Param() id: string, @Body() tour: Tour): Promise<Tour> {
    return this.toursService.update(id, tour);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete tour',
    description: 'Delete tour',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiResponse({ status: 200 })
  async delete(@Param() id: string): Promise<void> {
    return this.toursService.softDelete(id);
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: 'Restore tour',
    description: 'Restore tour',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiResponse({ status: 200 })
  async restore(@Param() id: string): Promise<void> {
    return this.toursService.restore(id);
  }
}
