import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitySchema } from 'src/activities/activity.schema';
import { ParticipantSchema } from 'src/participants/participant.schema';
import { TourSchema } from 'src/tours/tour.schema';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tour', schema: TourSchema },
      { name: 'Activity', schema: ActivitySchema },
      { name: 'Participant', schema: ParticipantSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
