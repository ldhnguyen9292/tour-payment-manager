import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { objectId } from 'src/lib/mongoose';
import { User } from 'src/users/user.schema';
import { Participant, ParticipantModel } from './participant.schema';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel('Participant')
    private participantModel: typeof ParticipantModel,
  ) {}

  async findAll(tourId: string, user: User) {
    return await this.participantModel.find({
      tour: objectId(tourId),
      user,
      isDeleted: false,
    });
  }

  async findById(id: string) {
    return await this.participantModel.findById(objectId(id));
  }

  async create(tourId: string, user: User, data: Participant) {
    return await this.participantModel.create({
      ...data,
      tour: objectId(tourId),
      user,
    });
  }

  async update(tourId: string, id: string, user: User, data: Participant) {
    return await this.participantModel.findOneAndUpdate(
      { _id: objectId(id), tour: objectId(tourId), user },
      data,
      { new: true },
    );
  }

  async softDelete(id: string) {
    return await this.participantModel.softDelete(id);
  }
}
