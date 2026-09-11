import { Injectable } from '@nestjs/common';
import { Membership, MembershipRole } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class MembershipRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Membership | null> {
    return client.membership.findUnique({
      where: { id },
    });
  }

  async findByUserAndOrganization(
    userId: string,
    organizationId: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Membership | null> {
    return client.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });
  }

  async findByOrganization(organizationId: string): Promise<Membership[]> {
    return this.database.membership.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findByUser(userId: string): Promise<Membership[]> {
    return this.database.membership.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    data: {
      userId: string;
      organizationId: string;
      role?: MembershipRole;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Membership> {
    return client.membership.create({
      data: {
        userId: data.userId,
        organizationId: data.organizationId,
        role: data.role ?? MembershipRole.MEMBER,
      },
    });
  }

  async updateRole(
    id: string,
    role: MembershipRole,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Membership> {
    return client.membership.update({
      where: { id },
      data: {
        role,
      },
    });
  }

  async delete(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Membership> {
    return client.membership.delete({
      where: { id },
    });
  }
}
