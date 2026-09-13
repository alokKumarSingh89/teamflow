import { Injectable } from '@nestjs/common';

import { Membership, MembershipRole } from '../../generated/prisma/client';

import { DatabaseService } from '../../database/database.service';

@Injectable()
export class MembershipRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<Membership | null> {
    return this.database.membership.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUserAndOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null> {
    return this.database.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
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

  async findByOrganization(organizationId: string): Promise<Membership[]> {
    return this.database.membership.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    userId: string;
    organizationId: string;
    role: MembershipRole;
  }): Promise<Membership> {
    return this.database.membership.create({
      data,
    });
  }

  async updateRole(id: string, role: MembershipRole): Promise<Membership> {
    return this.database.membership.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });
  }

  async delete(id: string): Promise<Membership> {
    return this.database.membership.delete({
      where: {
        id,
      },
    });
  }
}
