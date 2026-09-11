import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserStatus } from '../generated/prisma/enums';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async getByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async list(params?: {
    status?: UserStatus;
    limit?: number;
    offset?: number;
  }) {
    return this.userRepository.findMany(params);
  }

  async create(data: { email: string; name: string }) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    return this.userRepository.create(data);
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: UserStatus;
    },
  ) {
    await this.getById(id);

    return this.userRepository.update(id, data);
  }
}
