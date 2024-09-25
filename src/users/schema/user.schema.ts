import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ACCOUNT_TYPE } from '../../constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.String, trim: true })
  email: string;

  @Prop({ type: SchemaTypes.String })
  first_name: string;

  @Prop({ type: SchemaTypes.String })
  last_name: string;

  @Prop({ type: SchemaTypes.String })
  username: string;

  @Prop({ type: SchemaTypes.String, default: '' })
  password: string;

  @Prop({ type: SchemaTypes.String, require: true })
  profile_url: string;

  @Prop({ default: true, type: SchemaTypes.Boolean })
  account_active: boolean;

  @Prop({ enum: ACCOUNT_TYPE, type: SchemaTypes.String })
  role: ACCOUNT_TYPE;
}

export const UserSchema = SchemaFactory.createForClass(User);
