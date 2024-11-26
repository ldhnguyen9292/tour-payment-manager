import { Controller, Get, Param } from '@nestjs/common';

import { TeamMembersService } from './team-members.service';

@Controller('team-members')
export class TeamMembersController {
  constructor(private teamMembersService: TeamMembersService) {}

  @Get()
  async findAll() {
    return this.teamMembersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }
}
