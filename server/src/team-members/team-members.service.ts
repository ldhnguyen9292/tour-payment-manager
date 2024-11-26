import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TeamMember } from './team-member.schema';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectModel('TeamMember') private teamMemberModel: Model<TeamMember>,
  ) {}

  async findAll(): Promise<TeamMember[]> {
    return this.teamMemberModel.find().exec();
  }

  async findOne(id: string): Promise<TeamMember> {
    return this.teamMemberModel.findById(id).exec();
  }
}
