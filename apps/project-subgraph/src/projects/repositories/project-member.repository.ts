import { Injectable } from '@nestjs/common';
import { ProjectMember } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class ProjectMemberRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<ProjectMember | null> {
    return client.projectMember.findUnique({
      where: {
        id,
      },
    });
  }

  async findByProjectAndUser(
    projectId: string,
    userId: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<ProjectMember | null> {
    return client.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async findByProject(projectId: string): Promise<ProjectMember[]> {
    return this.database.projectMember.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(
    data: {
      projectId: string;
      userId: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<ProjectMember> {
    return client.projectMember.create({
      data,
    });
  }

  async delete(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<ProjectMember> {
    return client.projectMember.delete({
      where: {
        id,
      },
    });
  }
}
