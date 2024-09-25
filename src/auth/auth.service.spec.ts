import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDataDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schema/user.schema';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: {
    registerUser: jest.Mock;
    login: jest.Mock;
    refreshToken: jest.Mock;
    logout: jest.Mock;
  };

  beforeEach(async () => {
    mockAuthService = {
      registerUser: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerDto: RegisterUserDataDto = {
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10); // Hash the password
      const user = {
        ...registerDto,
        username: 'john_doe',
        password: hashedPassword,
        _id: 'userId',
      };

      const result: ApiResponse<Partial<User>> = {
        message: 'User registered successfully',
        data: user,
        status: true,
      };

      mockAuthService.registerUser.mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(registerDto);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          ...registerDto,
          username: 'john_doe',
          password: hashedPassword, // Ensure the hashed password is being compared
        }),
      );
    });

    it('should throw an error if registration fails', async () => {
      const registerDto: RegisterUserDataDto = {
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
      };

      mockAuthService.registerUser.mockRejectedValue(
        new Error('User already exists'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user = {
        email: 'john@example.com',
        username: 'john_doe',
        _id: 'userId',
      };

      const result: ApiResponse<any> = {
        message: 'Login successfully',
        status: true,
        data: {
          user,
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      };

      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error if login fails', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrongPassword',
      };

      mockAuthService.login.mockRejectedValue(
        new Error('Invalid credentials, please try again'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials, please try again',
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh the token successfully', async () => {
      const refreshToken = 'someRefreshToken';
      const result: ApiResponse<any> = {
        message: 'Successfully refreshed tokens',
        status: true,
        data: {
          user: { email: 'john@example.com', username: 'john_doe' },
          accessToken: 'newAccessToken',
          refreshToken: 'newRefreshToken',
        },
      };

      mockAuthService.refreshToken.mockResolvedValue(result);

      expect(await controller.refreshToken(refreshToken)).toEqual(result);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
    });

    it('should throw an error if refresh token is invalid', async () => {
      const refreshToken = 'invalidToken';
      mockAuthService.refreshToken.mockRejectedValue(
        new Error('Invalid refresh token'),
      );

      await expect(controller.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });

  describe('logout', () => {
    it('should log out successfully', async () => {
      const req = { user: { _id: 'userId' } };

      const result: ApiResponse<void> = {
        message: 'Logged out successfully',
        data: null,
        status: true,
      };

      mockAuthService.logout.mockResolvedValue(result);

      expect(await controller.logout(req)).toEqual(result);
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        req.user._id.toString(),
      );
    });
  });
});
