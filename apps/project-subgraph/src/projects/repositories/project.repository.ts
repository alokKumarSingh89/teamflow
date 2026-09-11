import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Project, ProjectStatus } from '../../generated/prisma/client';

@Injectable()
export class ProjectRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<Project | null> {
    return this.database.project.findUnique({
      where: {
        id,
      },
    });
  }

  async findMany(params?: {
    organizationId?: string;
    status?: ProjectStatus;
    limit?: number;
    offset?: number;
  }): Promise<Project[]> {
    return this.database.project.findMany({
      where: {
        organizationId: params?.organizationId,
        status: params?.status,
      },
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    organizationId: string;
    name: string;
    description?: string;
    ownerId: string;
  }): Promise<Project> {
    return this.database.project.create({
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
  ): Promise<Project> {
    return this.database.project.update({
      where: {
        id,
      },
      data,
    });
  }
}
