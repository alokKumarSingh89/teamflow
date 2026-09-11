import { Injectable } from '@nestjs/common';
import { Label } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class LabelRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Label | null> {
    return client.label.findUnique({
      where: {
        id,
      },
    });
  }

  async findByProject(projectId: string): Promise<Label[]> {
    return this.database.label.findMany({
      where: {
        projectId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByProjectAndName(
    projectId: string,
    name: string,
  ): Promise<Label | null> {
    return this.database.label.findUnique({
      where: {
        projectId_name: {
          projectId,
          name,
        },
      },
    });
  }

  async create(
    data: {
      projectId: string;
      name: string;
      color: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Label> {
    return client.label.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      color?: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Label> {
    return client.label.update({
      where: {
        id,
      },
      data,
    });
  }
}
