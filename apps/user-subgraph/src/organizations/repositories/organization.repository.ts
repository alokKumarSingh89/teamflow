import { Injectable } from '@nestjs/common';
import {
  Organization,
  OrganizationStatus,
} from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Organization | null> {
    return client.organization.findUnique({
      where: { id },
    });
  }

  async findMany(params?: {
    status?: OrganizationStatus;
    limit?: number;
    offset?: number;
  }): Promise<Organization[]> {
    return this.database.organization.findMany({
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
      name: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Organization> {
    return client.organization.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: OrganizationStatus;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Organization> {
    return client.organization.update({
      where: { id },
      data,
    });
  }
}
