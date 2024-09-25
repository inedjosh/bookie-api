import { Types } from 'mongoose';
import { BOOK_GENRE } from 'src/constants';

export interface Review {
  userId: string;
  rating: number;
  comment?: string;
}

export interface ICreateBook {
  _id?: string;
  title: string;
  author: Types.ObjectId;
  user: Types.ObjectId;
  description?: string;
  reviews?: Review[];
  publishedDate?: Date;
  book_url: string;
  genre: BOOK_GENRE;
}
