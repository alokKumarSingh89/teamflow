import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrganizationStatus } from '../generated/prisma/client';

import { OrganizationRepository } from './repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async getById(id: string) {
    const organization = await this.organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    return organization;
  }

  async list(params?: {
    status?: OrganizationStatus;
    limit?: number;
    offset?: number;
  }) {
    return this.organizationRepository.findMany(params);
  }

  async createOrganization(data: { name: string; ownerId: string }) {
    const existing = await this.organizationRepository.findByName(data.name);

    if (existing) {
      throw new ConflictException(`Organization "${data.name}" already exists`);
    }

    return this.organizationRepository.createWithOwner(data);
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: OrganizationStatus;
    },
  ) {
    await this.getById(id);

    return this.organizationRepository.update(id, data);
  }
}
