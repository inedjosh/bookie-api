import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  bio: string;

  @Prop({ type: String, required: true })
  pen_name: string;

  @Prop({ type: [String], required: true })
  genres: string[];

  @Prop({ type: Number, default: 2.5 })
  rating: number;

  @Prop({ type: [Types.ObjectId], ref: 'Book' })
  books: Types.ObjectId[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
