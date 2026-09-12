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

  async findByName(name: string): Promise<Organization | null> {
    return this.database.organization.findFirst({
      where: {
        name,
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

  async createWithOwner(data: {
    name: string;
    ownerId: string;
  }): Promise<Organization> {
    return this.database.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.name,
        },
      });

      await tx.membership.create({
        data: {
          userId: data.ownerId,
          organizationId: organization.id,
          role: 'OWNER',
        },
      });

      return organization;
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
