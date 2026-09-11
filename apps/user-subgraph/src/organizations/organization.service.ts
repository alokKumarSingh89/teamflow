import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationStatus } from '../generated/prisma/client';
import { DatabaseService } from '../database/database.service';
import { MembershipRole } from '../generated/prisma/client';
import { MembershipRepository } from '../memberships/repositories/membership.repository';
import { OrganizationRepository } from './repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly database: DatabaseService,
    private readonly organizationRepository: OrganizationRepository,
    private readonly membershipRepository: MembershipRepository,
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
    /**
     * Organization creation and owner membership are one
     * business operation.
     *
     * Either both records exist or neither exists.
     */
    return this.database.$transaction(async (tx) => {
      const organization = await this.organizationRepository.create(
        {
          name: data.name,
        },
        tx,
      );

      await this.membershipRepository.create(
        {
          userId: data.ownerId,
          organizationId: organization.id,
          role: MembershipRole.OWNER,
        },
        tx,
      );

      return organization;
    });
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
