import { Injectable } from '@nestjs/common';
import { Team, TeamStatus } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class TeamRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Team | null> {
    return client.team.findUnique({
      where: { id },
    });
  }

  async findByOrganization(organizationId: string): Promise<Team[]> {
    return this.database.team.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'asc',
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

  async create(
    data: {
      organizationId: string;
      name: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Team> {
    return client.team.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: TeamStatus;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Team> {
    return client.team.update({
      where: { id },
      data,
    });
  }
}
