import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schema/auth.schema';
import { Model } from 'mongoose';
import { ICreateAuthSession } from './interface/create-auth-session.interface';

/**
 * Repository for handling authentication session data.
 * @class AuthRepository
 */
@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  /**
   * Creates or updates an authentication session for a user.
   * @async
   * @param {string} user_id - The ID of the user.
   * @param {ICreateAuthSession} data - The session data to store.
   * @returns {Promise<boolean>} Indicates whether the operation was successful.
   */
  async createSession(
    user_id: string,
    data: ICreateAuthSession,
  ): Promise<boolean> {
    const session = await this.authModel.findOne({ user_id });

    if (!session) {
      await this.authModel.create({
        user_id,
        data,
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });
    } else {
      session.data = data;
      session.expires = Date.now() + 60 * 60 * 1000; // 1 hour
      await session.save();
    }
    return true;
  }

  /**
   * Retrieves the authentication session for a user.
   * @async
   * @param {string} user_id - The ID of the user.
   * @returns {Promise<ICreateAuthSession | false>} The session data or false if expired or not found.
   */
  async getSession(user_id: string): Promise<ICreateAuthSession | false> {
    const session = await this.authModel.findOne({ user_id });

    if (!session || session.expires < Date.now()) {
      if (session) {
        await this.authModel.deleteOne({ user_id });
      }
      return false;
    }

    return session.data;
  }

  /**
   * Updates the authentication session data for a user.
   * @async
   * @param {string} user_id - The ID of the user.
   * @param {Partial<ICreateAuthSession>} updatedData - The updated session data.
   * @returns {Promise<void>}
   */
  async updateSession(
    user_id: string,
    updatedData: Partial<ICreateAuthSession>,
  ): Promise<void> {
    await this.authModel.findOneAndUpdate({ user_id }, updatedData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Deletes the authentication session for a user.
   * @async
   * @param {string} user_id - The ID of the user.
   * @returns {Promise<boolean>} Indicates whether the operation was successful.
   */
  async deleteSession(user_id: string): Promise<boolean> {
    await this.authModel.findOneAndDelete({ user_id });
    return true;
  }
}
