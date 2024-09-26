import { Types } from 'mongoose';

export interface ICreateReview {
  user: Types.ObjectId;
  book: Types.ObjectId;
  rating: number;
  comment: string;
  profile_url: string;
  name: string;
}
