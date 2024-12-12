import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { objectId } from 'src/lib/mongoose';
import { User } from 'src/users/user.schema';
import { Tour, TourModel } from './tour.schema';

@Injectable()
export class ToursService {
  constructor(@InjectModel('Tour') private tourModel: typeof TourModel) {}

  async findAll(user: User): Promise<Tour[]> {
    return this.tourModel.find({ user, isDeleted: false });
  }

  async findById(id: string): Promise<Tour> {
    return this.tourModel.findById(objectId(id));
  }

  async create(tour: Tour): Promise<Tour> {
    return this.tourModel.create(tour);
  }

  async update(id: string, tour: Tour): Promise<Tour> {
    return this.tourModel.findByIdAndUpdate(objectId(id), tour, {
      new: true,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.tourModel.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.tourModel.restore(id);
  }
}
