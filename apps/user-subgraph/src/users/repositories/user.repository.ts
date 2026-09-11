import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { User, UserStatus } from '../../generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: {
        id,
      },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: {
        email,
      },
    });
  }
  async findMany(params?: {
    status?: UserStatus;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    return this.database.user.findMany({
      where: {
        status: params?.status,
      },
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async create(data: { email: string; name: string }): Promise<User> {
    return this.database.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }
  async update(
    id: string,
    data: {
      name?: string;
      status?: UserStatus;
    },
  ): Promise<User> {
    return this.database.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
