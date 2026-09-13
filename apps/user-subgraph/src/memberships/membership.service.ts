import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MembershipRole } from '../generated/prisma/client';

import { MembershipRepository } from './repositories/membership.repository';

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async getById(id: string) {
    const membership = await this.membershipRepository.findById(id);

    if (!membership) {
      throw new NotFoundException(`Membership ${id} not found`);
    }

    return membership;
  }

  async listByUser(userId: string) {
    return this.membershipRepository.findByUser(userId);
  }

  async listByOrganization(organizationId: string) {
    return this.membershipRepository.findByOrganization(organizationId);
  }

  async create(data: {
    userId: string;
    organizationId: string;
    role: MembershipRole;
  }) {
    const existing = await this.membershipRepository.findByUserAndOrganization(
      data.userId,
      data.organizationId,
    );

    if (existing) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    return this.membershipRepository.create(data);
  }

  async updateRole(id: string, role: MembershipRole) {
    await this.getById(id);

    return this.membershipRepository.updateRole(id, role);
  }

  async remove(id: string) {
    await this.getById(id);

    return this.membershipRepository.delete(id);
  }
}
