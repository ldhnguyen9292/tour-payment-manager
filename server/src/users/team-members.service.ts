import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { objectId } from 'src/lib/mongoose';
import { UserModel } from './user.schema';

@Injectable()
export class TeamMembersService {
  constructor(@InjectModel('User') private userModel: typeof UserModel) {}

  async findAll(id: string) {
    return this.userModel
      .findById(objectId(id), { teamMembers: true })
      .populate('teamMembers')
      .exec();
  }

  async findOne(id: string, memberId: string) {
    return this.userModel
      .findById(objectId(id), { teamMembers: true })
      .populate({ path: 'teamMembers', match: { _id: memberId } })
      .exec();
  }

  async create(id: string, member: { id?: string; username?: string }) {
    const user = await this.userModel
      .findById(objectId(id), { teamMembers: true })
      .exec();

    if (!user) {
      return null;
    }

    if (member.id) {
      const memberUser = await this.userModel
        .findById(objectId(member.id))
        .exec();

      if (!memberUser) {
        throw new BadRequestException('Invalid team member ID');
      }

      user.teamMembers.push(memberUser);
      return user.save();
    } else {
      const memberUser = await this.userModel.create({
        username: member.username,
      });

      user.teamMembers.push(memberUser);
      return user.save();
    }
  }

  async update(id: string, memberId: string, member: { username?: string }) {
    const user = await this.userModel.findById(objectId(id)).exec();

    if (!user) {
      return null;
    }

    const memberUser = await this.userModel.findById(objectId(memberId)).exec();

    if (!memberUser) {
      return null;
    }

    memberUser.username = member.username;

    await memberUser.save();

    return 'Team member updated successfully';
  }

  async remove(id: string, memberId: string) {
    const user = await this.userModel
      .findById(objectId(id))
      .populate('teamMembers')
      .exec();

    if (!user) {
      return null;
    }

    user.teamMembers = user.teamMembers.filter(
      (member) => member._id.toString() !== memberId,
    );

    await user.save();

    return 'Team member removed successfully';
  }
}
