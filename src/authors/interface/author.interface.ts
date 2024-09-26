import { Types } from 'mongoose';

export interface ICreateAuthor {
  bio: string;
  user: Types.ObjectId;
  genres: string[];
  pen_name: string;
  name: string;
  profile_url: string;
}
