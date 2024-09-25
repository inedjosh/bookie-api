import { forwardRef, Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BookService } from './books.service';
import { Book, BookSchema } from './schema/book.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BookRepository } from './book.repository';
import { Auth, AuthSchema } from '../auth/schema/auth.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AuthorsModule } from '../authors/authors.module';
import { Review, Reviewchema } from './schema/comments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Review.name, schema: Reviewchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthorsModule),
  ],
  providers: [BookService, BookRepository],
  controllers: [BooksController],
  exports: [BookRepository, BookService],
})
export class BooksModule {}
