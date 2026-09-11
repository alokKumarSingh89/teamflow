import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeamStatus } from '../generated/prisma/client';
import { TeamRepository } from './repositories/team.repository';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async getById(id: string) {
    const team = await this.teamRepository.findById(id);

    if (!team) {
      throw new NotFoundException(`Team ${id} not found`);
    }

    return team;
  }

  async listByOrganization(organizationId: string) {
    return this.teamRepository.findByOrganization(organizationId);
  }

  async create(data: { organizationId: string; name: string }) {
    const existing = await this.teamRepository.findByOrganizationAndName(
      data.organizationId,
      data.name,
    );

    if (existing) {
      throw new ConflictException(`Team "${data.name}" already exists`);
    }

    return this.teamRepository.create(data);
  }

  async update(
    id: string,
    data: {
      name?: string;
      status?: TeamStatus;
    },
  ) {
    await this.getById(id);

    return this.teamRepository.update(id, data);
  }
}
