import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { addSoftDelete } from 'src/plugins/mongoose';

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  name?: string;

  @Prop({ required: false }) // Optional for OAuth users
  password?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  provider?: string;

  @Prop()
  providerId?: string;

  @Prop()
  avatarUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(addSoftDelete); // Apply the plugin
