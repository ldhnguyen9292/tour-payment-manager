import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Document, model, Schema as MongooseSchema } from 'mongoose';

import { Activity } from 'src/activities/activity.schema';
import { MongoosePluginModel, SoftDeletePlugin } from 'src/lib/mongoose';
import { Tour } from 'src/tours/tour.schema';
import { User } from 'src/users/user.schema';

@Schema({ collection: 'participants', timestamps: true })
@ApiSchema({ name: 'Participant' })
class Participant extends Document {
  @Prop({ required: true })
  @ApiProperty({
    type: 'string',
    description: 'The name of the participant',
    example: 'Participant Name',
  })
  name: string;

  @Prop({ default: 0 })
  @ApiProperty({
    type: 'number',
    description: 'The total amount paid by the participant',
    example: 100,
  })
  totalPaid: number;

  @Prop({ default: 0 })
  @ApiProperty({
    type: 'number',
    description: 'The total amount owed by the participant',
    example: 100,
  })
  totalOwed: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour' })
  @ApiProperty({
    type: 'string',
    description: 'The tour the participant is part of',
    example: 'tour1',
  })
  tour: Tour;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Activity' }],
    default: [],
  })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      description: 'The activities paid by the participant',
      example: 'activity1',
    },
  })
  paidActivities: Activity[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  @ApiProperty({
    type: 'string',
    description: 'Map the participant to a user',
    example: 'user1',
  })
  user?: User;
}

const ParticipantSchema = SchemaFactory.createForClass(Participant);
ParticipantSchema.plugin(SoftDeletePlugin);

const ParticipantModel = model(
  'Participant',
  ParticipantSchema,
) as MongoosePluginModel<Participant>;

export { Participant, ParticipantModel, ParticipantSchema };
