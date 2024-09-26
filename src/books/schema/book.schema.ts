import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BOOK_GENRE } from 'src/constants';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Review', required: true })
  reviews: Types.ObjectId[];

  @Prop()
  description: string;

  @Prop({ enum: BOOK_GENRE, required: true })
  genre: BOOK_GENRE;

  @Prop({ type: String, required: true })
  book_image_url: string;

  @Prop({ type: String, required: true })
  book_url: string;

  @Prop()
  published_date: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
