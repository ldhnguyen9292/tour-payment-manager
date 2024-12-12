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
import { Participant } from './participant.schema';
import { ParticipantsService } from './participants.service';

@Controller('tours/:tourId/participants')
@ApiTags('Participants')
@UseGuards(AuthenticatedGuard)
export class ParticipantsController {
  constructor(private participantsService: ParticipantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all participants',
    description: 'Get all participants',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiResponse({ status: 200, type: [Participant] })
  async findAll(@Req() req, @Param('tourId') tourId: string) {
    const user = req.user as User;
    return await this.participantsService.findAll(tourId, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one participant',
    description: 'Get one participant',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Participant ID',
  })
  @ApiResponse({ status: 200, type: Participant })
  async findOne(@Param('id') id: string) {
    return await this.participantsService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create participant',
    description: 'Create participant',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiBody({ type: Participant })
  @ApiResponse({ status: 201, type: Participant })
  async createParticipant(
    @Req() req,
    @Param('tourId') tourId: string,
    @Body() participant: Participant,
  ) {
    const user = req.user as User;
    return await this.participantsService.create(tourId, user, participant);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update participant',
    description: 'Update participant',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Participant ID',
  })
  @ApiBody({ type: Participant })
  @ApiResponse({ status: 200, type: Participant })
  async updateParticipant(
    @Req() req,
    @Param('tourId') tourId: string,
    @Param('id') id: string,
    @Body() participant: Participant,
  ) {
    const user = req.user as User;
    return await this.participantsService.update(tourId, id, user, participant);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete participant',
    description: 'Delete participant',
  })
  @ApiParam({
    name: 'tourId',
    type: 'string',
    description: 'Tour ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Participant ID',
  })
  @ApiResponse({ status: 200 })
  async deleteParticipant(@Param('id') id: string) {
    return await this.participantsService.softDelete(id);
  }
}
