import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Document, model, Schema as MongooseSchema } from 'mongoose';

import { MongoosePluginModel, SoftDeletePlugin } from 'src/lib/mongoose';
import { Tour } from 'src/tours/tour.schema';

@Schema({ collection: 'users', timestamps: true })
@ApiSchema({
  name: 'User',
})
class User extends Document {
  @Prop({ required: true, unique: true })
  @ApiProperty({
    type: 'string',
    description: 'The username of the user',
    example: 'newuser',
  })
  username: string;

  @Prop()
  @ApiProperty({
    type: 'string',
    description: 'The name of the user',
    example: 'New User',
    required: false,
  })
  name?: string;

  @Prop({ select: false }) // Optional for OAuth users
  password?: string;

  @Prop({ unique: true })
  @ApiProperty({
    type: 'string',
    description: 'The email of the user',
    example: 'newuser@yopmail.com',
    required: false,
  })
  email?: string;

  @Prop({ default: false })
  @ApiProperty({
    type: 'boolean',
    description: 'The admin status of the user',
    example: false,
    required: false,
  })
  isAdmin: boolean;

  @Prop()
  provider?: string;

  @Prop()
  providerId?: string;

  @Prop()
  @ApiProperty({
    type: 'string',
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatarUrl?: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  teamMembers?: User[];

  @Prop()
  resetPasswordToken?: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tour' }],
    default: [],
  })
  tours?: Tour[];
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(SoftDeletePlugin);

const UserModel = model<User>('User', UserSchema) as MongoosePluginModel<User>;

export { User, UserModel, UserSchema };
