import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParticipantSchema } from './participant.schema';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Participant', schema: ParticipantSchema },
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
