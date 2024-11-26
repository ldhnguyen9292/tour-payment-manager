import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { TeamMemberSchema } from './team-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TeamMember', schema: TeamMemberSchema },
    ]),
  ],
  providers: [TeamMembersService],
  controllers: [TeamMembersController],
})
export class TeamMembersModule {}
