import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'team_members', timestamps: true })
export class TeamMember extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  paid: number;

  @Prop({ required: true })
  total: number;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
