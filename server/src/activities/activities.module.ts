import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitySchema } from './activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Activity', schema: ActivitySchema }]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
