import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TeamMembersService } from './team-members.service';
import { UsersController } from './user.controller';
import { UserSchema } from './user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, ConfigService, TeamMembersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
