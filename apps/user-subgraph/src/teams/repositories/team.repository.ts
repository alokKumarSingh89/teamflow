import { Injectable } from '@nestjs/common';
import { Team, TeamStatus } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class TeamRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<Team | null> {
    return this.database.team.findUnique({
      where: {
        id,
      },
    });
  }

  async findByOrganization(organizationId: string): Promise<Team[]> {
    return this.database.team.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByOrganizationAndName(
    organizationId: string,
    name: string,
  ): Promise<Team | null> {
    return this.database.team.findUnique({
      where: {
        organizationId_name: {
          organizationId,
          name,
        },
      },
    });
  }

  async create(data: { organizationId: string; name: string }): Promise<Team> {
    return this.database.team.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: TeamStatus;
    },
  ): Promise<Team> {
    return this.database.team.update({
      where: {
        id,
      },
      data,
    });
  }

  async findManyByOrganizationIds(organizationIds: readonly string[]) {
    return this.database.team.findMany({
      where: {
        organizationId: {
          in: [...organizationIds],
        },
      },
      orderBy: [
        {
          organizationId: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    });
  }
}
