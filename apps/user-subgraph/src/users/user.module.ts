import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserPaginationResolver } from './user-pagination.resolver';

@Module({
  providers: [
    UserRepository,
    UserService,
    UserResolver,
    UserPaginationResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
