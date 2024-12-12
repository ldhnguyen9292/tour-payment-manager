import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { objectId } from 'src/lib/mongoose';
import { Activity, ActivityModel } from './activity.schema';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel('Activity') private activityModel: typeof ActivityModel,
  ) {}

  async findAll(tourId: string) {
    return this.activityModel.find({ tour: tourId });
  }

  async findById(id: string) {
    return this.activityModel.findById(objectId(id));
  }

  async create(tourId: string, data: Activity) {
    return this.activityModel.create({ ...data, tour: objectId(tourId) });
  }

  async update(id: string, data: Activity) {
    return this.activityModel.findOneAndUpdate({ _id: objectId(id) }, data, {
      new: true,
    });
  }

  async softDelete(id: string) {
    return this.activityModel.softDelete(id);
  }

  async restore(id: string) {
    return this.activityModel.restore(id);
  }
}
