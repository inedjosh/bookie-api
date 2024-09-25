import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './books.service';
import { BookRepository } from './book.repository';
import { UserRepository } from '../users/user.repository';
import { AuthorRepository } from '../authors/author.repository';

describe('BooksService', () => {
  let service: BookService;

  beforeEach(async () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BookService,
          {
            provide: BookRepository,
            useValue: {},
          },
          {
            provide: UserRepository,
            useValue: {},
          },
          {
            provide: AuthorRepository,
            useValue: {},
          },
        ],
      }).compile();

      service = module.get<BookService>(BookService);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
