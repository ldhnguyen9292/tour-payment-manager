import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TourSchema } from './tour.schema';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tour', schema: TourSchema }])],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
