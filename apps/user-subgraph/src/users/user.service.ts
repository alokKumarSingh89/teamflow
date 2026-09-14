import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserStatus } from '../generated/prisma/client';
import { UserRepository } from './repositories/user.repository';

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
    return this.userRepository.findByEmail(this.normalizeEmail(email));
  }

  async list(params?: {
    status?: UserStatus;
    limit?: number;
    offset?: number;
  }) {
    return this.userRepository.findMany(params);
  }

  async create(data: { email: string; name: string }) {
    const email = this.normalizeEmail(data.email);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    return this.userRepository.create({
      email,
      name: data.name.trim(),
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: UserStatus;
    },
  ) {
    await this.getById(id);

    return this.userRepository.update(id, {
      ...data,
      name: data.name?.trim(),
    });
  }

  async listPaginated(params: {
    first: number;
    after?: string;
    search?: string;
    email?: string;
    status?: UserStatus;
  }) {
    const users = await this.userRepository.findPaginated(params);

    return users;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
