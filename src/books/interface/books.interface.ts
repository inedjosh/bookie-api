import { Types } from 'mongoose';
import { BOOK_GENRE } from 'src/constants';

export interface ICreateBook {
  _id?: string;
  title: string;
  author: Types.ObjectId;
  user: Types.ObjectId;
  description?: string;
  published_date?: Date;
  book_url: string;
  book_image_url: string;
  genre: BOOK_GENRE;
  review: Types.ObjectId[];
  readers?: Types.ObjectId[];
}
