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

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() data: RegisterUserDataDto,
  ): Promise<
    ApiResponse<
      Partial<{ User: User; accessToken: string; refreshToken: string }>
    >
  > {
    return await this.authService.registerUser(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto): Promise<ApiResponse<Partial<User>>> {
    return await this.authService.login(data);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  async refresh(@Req() req): Promise<ApiResponse<Partial<User>>> {
    return await this.authService.refresh(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Req() req): Promise<ApiResponse<void>> {
    return await this.authService.logout(req.user._id.toString());
  }
}
