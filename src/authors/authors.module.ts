import { forwardRef, Module } from '@nestjs/common';
import { AuthorService } from './authors.service';
import { Author, AuthorSchema } from './schema/author.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorRepository } from './author.repository';
import { AuthorController } from './authors.controller';
import { Auth, AuthSchema } from '../auth/schema/auth.schema';
import { AuthRepository } from '../auth/auth.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthorService, AuthorRepository],
  controllers: [AuthorController],
  exports: [AuthorRepository],
})
export class AuthorsModule {}
