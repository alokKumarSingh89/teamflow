import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserPaginationResolver } from './user-pagination.resolver';
import { UserLoader } from './user.loader';

@Module({
  providers: [
    UserRepository,
    UserService,
    UserResolver,
    UserPaginationResolver,
    UserLoader,
  ],
  exports: [UserService, UserLoader],
})
export class UserModule {}
