import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserStatus } from '../generated/prisma/client';
import { UserRepository } from './repositories/user.repository';
import { UserPaginationArgs } from './pagination/user-pagination.args';
import { UserFilterInput } from './user-filter.input';
import { UserConnectionType } from './pagination/user-connection.type';
import { decodeCursor, encodeCursor } from '../common/cursor';

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

  async listPaginated(args: UserPaginationArgs): Promise<UserConnectionType> {
    const first = args.first ?? 20;

    let cursor:
      | {
          createdAt: Date;
          id: string;
        }
      | undefined;

    if (args.after) {
      try {
        const decoded = decodeCursor(args.after);

        cursor = {
          createdAt: new Date(decoded.createdAt),
          id: decoded.id,
        };
      } catch {
        throw new BadRequestException('Invalid pagination cursor');
      }
    }

    const search = args.filter?.search?.trim();

    const users = await this.userRepository.findPaginated(
      first,
      cursor,
      args.filter?.status,
      search || undefined,
    );

    const hasNextPage = users.length > first;

    const pageUsers = hasNextPage ? users.slice(0, first) : users;

    const edges = pageUsers.map((user) => ({
      cursor: encodeCursor(user.createdAt, user.id),
      node: user,
    }));

    return {
      edges,
      nodes: pageUsers,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: Boolean(args.after),
        startCursor: edges[0]?.cursor ?? null,
        endCursor: edges[edges.length - 1]?.cursor ?? null,
      },
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
