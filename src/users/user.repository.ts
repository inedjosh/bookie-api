import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: Partial<User>): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(data);
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException(error.message || 'Error creating user');
    }
  }

  async updateById(id: string, data: any): Promise<UserDocument> {
    try {
      const result = await this.userModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true, runValidators: true },
      );

      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Error updating user');
    }
  }

  async getById(id: string): Promise<UserDocument> {
    try {
      const result = await this.userModel.findById(id);

      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Error retrieving user');
    }
  }

  async findOne(query: any): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne(query);
    } catch (error) {
      throw new BadRequestException(error.message || 'Error finding user');
    }
  }

  async findByIdAndUpdate(id: string, data: any): Promise<UserDocument> {
    try {
      const result = await this.userModel.findByIdAndUpdate(
        id,
        { ...data },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return result;
    } catch (error) {
      throw new BadRequestException(error.message || 'Error updating user');
    }
  }

  async findOneUserAndUpdate(
    query: any,
    data: any,
  ): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOneAndUpdate(
        query,
        { ...data },
        {
          new: true,
          runValidators: true,
        },
      );
    } catch (error) {
      throw new BadRequestException(error.message || 'Error updating user');
    }
  }
}
