import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EditProfileDto } from './dto/edit-profile';
import { User } from './schema/user.schema';

@UseGuards(AuthGuard)
@Controller('v1/user')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req): Promise<ApiResponse<Partial<User>>> {
    return await this.userService.getUser(req.user.email);
  }

  @Put()
  async editUser(
    @Req() req,
    @Body() data: EditProfileDto,
  ): Promise<ApiResponse<Partial<User>>> {
    return await this.userService.editUser(req.user.email, data);
  }
}
