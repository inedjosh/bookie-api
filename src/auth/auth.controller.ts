import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterUserDataDto } from './dto/register-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from '../users/schema/user.schema';

/**
 * Controller for handling authentication-related routes.
 * @class AuthController
 */
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * @async
   * @param {RegisterUserDataDto} data - The registration data for the new user.
   * @returns {Promise<ApiResponse<Partial<User>>>} A promise that resolves to the API response containing the registered user's data.
   */
  @Post('register')
  async register(
    @Body() data: RegisterUserDataDto,
  ): Promise<ApiResponse<Partial<User>>> {
    return await this.authService.registerUser(data);
  }

  /**
   * Authenticates a user and returns a token.
   * @async
   * @param {LoginDto} data - The login credentials of the user.
   * @returns {Promise<ApiResponse<Partial<User>>>} A promise that resolves to the API response containing the authenticated user's data.
   */
  @Post('login')
  async login(@Body() data: LoginDto): Promise<ApiResponse<Partial<User>>> {
    return await this.authService.login(data);
  }

  /**
   * Refreshes the authentication token for the logged-in user.
   * @async
   * @param {Request} req - The request object containing the user's information.
   * @returns {Promise<ApiResponse<Partial<User>>>} A promise that resolves to the API response containing the refreshed user's data.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('refresh')
  async refresh(@Req() req): Promise<ApiResponse<Partial<User>>> {
    return await this.authService.refresh(req.user.id);
  }

  /**
   * Logs out the authenticated user by invalidating their token.
   * @async
   * @param {Request} req - The request object containing the user's information.
   * @returns {Promise<ApiResponse<void>>} A promise that resolves to the API response indicating successful logout.
   * @throws {UnauthorizedException} If the user is not authenticated.
   */
  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Req() req): Promise<ApiResponse<void>> {
    return await this.authService.logout(req.user.id);
  }
}
