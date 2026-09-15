import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { User } from '../generated/prisma/client';
import { UserRepository } from './repositories/user.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserLoader {
  readonly byId: DataLoader<string, User | null>;

  constructor(private readonly userRepository: UserRepository) {
    this.byId = new DataLoader<string, User | null>(async (userIds) => {
      const users = await this.userRepository.findManyByIds(userIds);

      const usersById = new Map(users.map((user) => [user.id, user]));

      return userIds.map((userId) => usersById.get(userId) ?? null);
    });
  }
}
