import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDataDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    registerUser: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
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
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto: RegisterUserDataDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = { message: 'User registered successfully' };
      mockAuthService.registerUser.mockResolvedValue(result);

      expect(await controller.register(registerDto)).toBe(result);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = { message: 'User logged in successfully' };
      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toBe(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refreshToken', () => {
    it('should refresh the token', async () => {
      const refreshToken = 'some-refresh-token';
      const result = { message: 'Token refreshed successfully' };
      mockAuthService.refreshToken.mockResolvedValue(result);

      expect(await controller.refreshToken(refreshToken)).toBe(result);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('logout', () => {
    it('should log out a user', async () => {
      const req = { user: { _id: 'userId' } };
      const result = { message: 'User logged out successfully' };
      mockAuthService.logout.mockResolvedValue(result);

      expect(await controller.logout(req)).toBe(result);
      expect(mockAuthService.logout).toHaveBeenCalledWith('userId');
    });
  });
});
