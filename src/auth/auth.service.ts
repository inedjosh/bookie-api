import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDataDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TokenFactory } from './utils/tokens.utils';
import { UserService } from '../users/users.service';
import { UserRepository } from '../users/user.repository';
import { sterilizeUser } from '../utils/sterilzer';
import { AuthRepository } from './auth.repository';
import { User } from '../users/schema/user.schema';
import { Types } from 'mongoose';
import { PROFILE_URL } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly tokenFactory: TokenFactory,
    private readonly config: ConfigService,
  ) {}

  private readonly saltRounds = 10;
  private readonly ACCESS_TOKEN_SECRET = this.config.get('ACCESS_TOKEN_SECRET');
  private readonly REFRESH_TOKEN_SECRET = this.config.get(
    'REFRESH_TOKEN_SECRET',
  );

  async registerUser(data: RegisterUserDataDto): Promise<ApiResponse<any>> {
    const { email } = data;
    const existingUser = await this.userRepository.findOne({ email });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const username = await this.userService.generateUniqueUsername(
      data.first_name,
      data.last_name,
    );

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    const user = await this.userRepository.createUser({
      ...data,
      username,
      password: hashedPassword,
      profile_url: PROFILE_URL,
    });

    const accessToken = await this.tokenFactory.generateAccessToken(
      this.ACCESS_TOKEN_SECRET,
      {
        id: user._id,
        email: user.email,
      },
    );

    const refreshToken = await this.tokenFactory.generateRefreshToken(
      this.REFRESH_TOKEN_SECRET,
      {
        id: user._id,
        email: user.email,
      },
    );

    await this.authRepository.createSession(user.id, {
      email: user.email,
      id: user._id.toString(),
      accessToken,
      refreshToken,
      role: user.role,
    });

    return {
      message: 'User registered successfully',
      data: {
        user: sterilizeUser(user),
        accessToken,
        refreshToken,
      },
      status: true,
    };
  }

  async login(data: LoginDto): Promise<ApiResponse<any>> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid credentials, please try again',
        success: false,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException({
        message: 'Invalid credentials, please try again',
        success: false,
      });
    }

    const accessToken = await this.tokenFactory.generateAccessToken(
      this.ACCESS_TOKEN_SECRET,
      {
        id: user._id,
        email: user.email,
      },
    );

    const refreshToken = await this.tokenFactory.generateRefreshToken(
      this.REFRESH_TOKEN_SECRET,
      {
        id: user._id,
        email: user.email,
      },
    );

    await this.authRepository.createSession(user.id, {
      email: user.email,
      id: user._id.toString(),
      accessToken,
      refreshToken,
      role: user.role,
    });

    return {
      message: 'Login successfully',
      status: true,
      data: {
        user: sterilizeUser(user),
        accessToken,
        refreshToken,
      },
    };
  }

  async refresh(userId: string): Promise<ApiResponse<any>> {
    const user = await this.userRepository.findOne({
      _id: new Types.ObjectId(userId),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      status: true,
      message: 'Successfully refreshed tokens',
      data: {
        user: sterilizeUser(user),
      },
    };
  }

  async logout(user_id: string): Promise<ApiResponse<void>> {
    await this.authRepository.deleteSession(user_id);

    return {
      message: 'Logged out successfully',
      data: null,
      status: true,
    };
  }
}
