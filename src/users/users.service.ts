import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { sterilizeUser } from '../utils/sterilzer';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EditProfileDto } from './dto/edit-profile';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly userRepository: UserRepository,
  ) {}

  private readonly saltRounds = 10;
  private readonly OTP_LENGTH = 4;

  async getUser(email: string): Promise<ApiResponse<Partial<User>>> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      message: 'User fetched successfully',
      data: sterilizeUser(user),
      status: true,
    };
  }

  async generateUniqueUsername(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const baseUsername = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    let uniqueUsername = baseUsername;
    let count = 1;

    while (await this.userRepository.findOne({ username: uniqueUsername })) {
      uniqueUsername = `${baseUsername}_${count}`;
      count++;
    }

    return uniqueUsername;
  }

  async editUser(
    email: string,
    data: EditProfileDto,
  ): Promise<ApiResponse<Partial<User>>> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (data.username) {
      const user = await this.userRepository.findOne({
        username: data.username,
      });

      if (user && data.username !== user.username)
        throw new BadRequestException('Username taken already');
    }

    const updatedUser = await this.userRepository.findByIdAndUpdate(
      user._id.toString(),
      data,
    );

    return {
      message: 'Profile updated successfully',
      data: sterilizeUser(updatedUser),
      status: true,
    };
  }
}
