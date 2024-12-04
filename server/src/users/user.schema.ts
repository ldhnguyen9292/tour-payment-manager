import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { addSoftDelete } from 'src/plugins/mongoose';

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  name?: string;

  @Prop({ select: false }) // Optional for OAuth users
  password?: string;

  @Prop({ unique: true })
  email?: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  provider?: string;

  @Prop()
  providerId?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  teamMembers?: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(addSoftDelete); // Apply the plugin
