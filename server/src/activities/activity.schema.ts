import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { model, Schema as MongooseSchema } from 'mongoose';

import { MongoosePluginModel, SoftDeletePlugin } from 'src/lib/mongoose';
import { Participant } from 'src/participants/participant.schema';
import { Tour } from 'src/tours/tour.schema';

@Schema({ collection: 'activities', timestamps: true })
@ApiSchema({ name: 'Activity' })
class Activity {
  @Prop({ required: true })
  @ApiProperty({
    type: 'string',
    description: 'The name of the activity',
    example: 'Activity Name',
  })
  name: string;

  @Prop({ required: true })
  @ApiProperty({
    type: 'number',
    description: 'The cost of the activity',
    example: 100,
  })
  cost: number;

  @Prop({ required: true })
  @ApiProperty({
    type: 'string',
    description: 'The type of split for the activity',
    example: 'equal',
    enum: ['equal', 'percentage'],
  })
  splitType: 'equal' | 'percentage';

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour' })
  @ApiProperty({
    type: 'string',
    description: 'The tour the activity is part of',
    example: 'tour1',
  })
  tour: Tour;

  @Prop({
    type: [{ participantId: MongooseSchema.Types.ObjectId, amount: Number }],
    default: [],
  })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        participantId: {
          type: 'string',
          description: 'The participant ID',
          example: 'participant1',
        },
        amount: {
          type: 'number',
          description: 'The amount paid by the participant',
          example: 100,
        },
      },
    },
  })
  splitDetails: { participantId: number; percentage: number }[]; // Only used for 'percentage' split

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Participant' })
  @ApiProperty({
    type: 'string',
    description: 'The participant who paid for the activity',
    example: 'participant1',
  })
  paidBy: Participant;
}

const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.plugin(SoftDeletePlugin);

const ActivityModel = model(
  'Activity',
  ActivitySchema,
) as MongoosePluginModel<Activity>;

export { Activity, ActivityModel, ActivitySchema };
