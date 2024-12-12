import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';
import { Activity } from './activity.schema';

@Controller('tours/:tourId/activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all activities',
    description: 'Get all activities',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiResponse({ status: 200, type: [Activity] })
  async findAll(@Param('tourId') tourId: string) {
    return this.activitiesService.findAll(tourId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one activity',
    description: 'Get one activity',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Activity ID',
  })
  @ApiResponse({ status: 200, type: Activity })
  async findOne(@Param('id') id: string) {
    return this.activitiesService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create an activity',
    description: 'Create an activity',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiBody({ type: Activity })
  @ApiResponse({ status: 201, type: Activity })
  async create(@Param('tourId') tourId: string, @Body() activity: Activity) {
    return this.activitiesService.create(tourId, activity);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an activity',
    description: 'Update an activity',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Activity ID',
  })
  @ApiBody({ type: Activity })
  @ApiResponse({ status: 200, type: Activity })
  async update(@Param('id') id: string, @Body() activity: Activity) {
    return this.activitiesService.update(id, activity);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an activity',
    description: 'Delete an activity',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Activity ID',
  })
  @ApiResponse({ status: 200 })
  async delete(@Param('id') id: string) {
    return this.activitiesService.softDelete(id);
  }
}
