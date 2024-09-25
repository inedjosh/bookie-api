import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop()
  bio: string;

  @Prop({ type: [Types.ObjectId], ref: 'Book' })
  books: Types.ObjectId[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
