import { Injectable } from '@nestjs/common';
import { Project, ProjectStatus } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class ProjectRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Project | null> {
    return client.project.findUnique({
      where: {
        id,
      },
    });
  }
  async findByOrganization(organizationId: string): Promise<Project[]> {
    return this.database.project.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async findMany(params?: {
    organizationId?: string;
    status?: ProjectStatus;
    ownerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Project[]> {
    return this.database.project.findMany({
      where: {
        organizationId: params?.organizationId,
        status: params?.status,
        ownerId: params?.ownerId,
      },
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    data: {
      organizationId: string;
      name: string;
      description?: string;
      ownerId: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Project> {
    return client.project.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: ProjectStatus;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Project> {
    return client.project.update({
      where: {
        id,
      },
      data,
    });
  }
}
