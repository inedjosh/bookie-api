import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ICreateAuthSession } from '../interface/create-auth-session.interface';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ type: String, ref: 'User', required: true })
  user_id: string;

  @Prop({ type: Object, required: true })
  data: ICreateAuthSession;

  @Prop({ type: SchemaTypes.Number, required: true })
  expires: number;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
