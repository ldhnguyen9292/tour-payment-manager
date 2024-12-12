import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema, model } from 'mongoose';

import { Activity } from 'src/activities/activity.schema';
import { MongoosePluginModel, SoftDeletePlugin } from 'src/lib/mongoose';
import { Participant } from 'src/participants/participant.schema';
import { User } from 'src/users/user.schema';

@Schema({ collection: 'tours', timestamps: true })
@ApiSchema({ name: 'Tour' })
class Tour extends Document {
  @Prop({ required: true })
  @ApiProperty({
    type: 'string',
    description: 'The name of the tour',
    example: 'Tour Name',
  })
  name: string;

  @Prop()
  @ApiProperty({
    type: 'string',
    description: 'The description of the tour',
    example: 'Tour Description',
    required: false,
  })
  description: string;

  @Prop({ default: 0 })
  @ApiProperty({
    type: 'number',
    description: 'The total amount spent on the tour',
    example: 100,
  })
  totalAmountSpent: number;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Activity' }],
    default: [],
  })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      description: 'The activities of the tour',
      example: 'activity1',
    },
  })
  activities: Activity[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      description: 'The participants of the tour',
      example: 'user1',
    },
  })
  participants: Participant[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @ApiProperty({
    type: 'string',
    description: 'The user who created the tour',
    example: 'user1',
  })
  createdBy: User;
}

const TourSchema = SchemaFactory.createForClass(Tour);
TourSchema.plugin(SoftDeletePlugin);

const TourModel = model<Tour>('Tour', TourSchema) as MongoosePluginModel<Tour>;

export { Tour, TourModel, TourSchema };
