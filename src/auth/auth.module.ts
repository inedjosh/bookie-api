import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schema/user.schema';
import { Auth, AuthSchema } from './schema/auth.schema';
import { UsersModule } from '../users/users.module';
import { AuthRepository } from './auth.repository';
import { TokenFactory } from './utils/tokens.utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, AuthRepository, TokenFactory],
  controllers: [AuthController],
  exports: [AuthService, AuthRepository, TokenFactory],
})
export class AuthModule {}
