import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schema/auth.schema';
import { Model } from 'mongoose';
import { ICreateAuthSession } from './interface/create-auth-session.interface';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  async createSession(user_id: string, data: ICreateAuthSession) {
    const session = await this.authModel.findOne({ user_id });

    if (!session) {
      await this.authModel.create({
        user_id,
        data,
        expires: Date.now() + 60 * 60 * 1000, // 1h
      });
    } else {
      session.data = data;
      session.expires = Date.now() + 60 * 60 * 1000; // 1h
      await session.save();
    }
    return true;
  }

  async getSession(user_id: string) {
    const session = await this.authModel.findOne({ user_id });

    if (!session || session.expires < Date.now()) {
      if (session) {
        await this.authModel.deleteOne({ user_id });
      }
      return false;
    }

    return session.data;
  }

  async updateSession(
    user_id: string,
    updatedData: Partial<ICreateAuthSession>,
  ): Promise<void> {
    return this.authModel.findOneAndUpdate({ user_id }, updatedData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteSession(user_id: string): Promise<boolean> {
    await this.authModel.findOneAndDelete({ user_id });
    return true;
  }
}
