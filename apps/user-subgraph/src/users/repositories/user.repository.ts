import { Inject, Injectable } from '@nestjs/common';
import { User, UserStatus } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DatabaseService)
    private readonly database: DatabaseService,
  ) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<User | null> {
    return client.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(
    email: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<User | null> {
    return client.user.findUnique({
      where: { email },
    });
  }

  async findMany(params?: {
    status?: UserStatus;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    return this.database.user.findMany({
      where: params?.status
        ? {
            status: params.status,
          }
        : undefined,
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    data: {
      email: string;
      name: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<User> {
    return client.user.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: UserStatus;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<User> {
    return client.user.update({
      where: { id },
      data,
    });
  }

  async findPaginated(params: {
    first: number;
    after?: string;
    search?: string;
    email?: string;
    status?: UserStatus;
  }) {
    const { first, after, search, email, status } = params;
    return this.database.user.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
        ...(email
          ? {
              email: {
                equals: email,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(status
          ? {
              status,
            }
          : {}),
      },
      ...(after
        ? {
            cursor: {
              id: after,
            },
            skip: 1,
          }
        : {}),
      take: first + 1,
      orderBy: {
        id: 'asc',
      },
    });
  }
  async findManyByIds(ids: readonly string[]) {
    return this.database.user.findMany({
      where: {
        id: {
          in: [...ids],
        },
      },
    });
  }
}
