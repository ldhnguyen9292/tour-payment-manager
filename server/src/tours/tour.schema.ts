import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema, model } from 'mongoose';

import { MongoosePluginModel, SoftDeletePlugin } from 'src/lib/mongoose';
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

  // Relation to User
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @ApiProperty({
    type: 'string',
    description: 'The user',
    example: 'User ID',
    required: true,
  })
  user: User;
}

const TourSchema = SchemaFactory.createForClass(Tour);
TourSchema.plugin(SoftDeletePlugin);

const TourModel = model<Tour>('Tour', TourSchema) as MongoosePluginModel<Tour>;

export { Tour, TourModel, TourSchema };
