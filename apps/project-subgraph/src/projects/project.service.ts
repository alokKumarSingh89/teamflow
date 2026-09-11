import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectStatus } from '../generated/prisma/client';
import { ProjectRepository } from './repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async getById(id: string) {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    return project;
  }

  async list(params?: {
    organizationId?: string;
    status?: ProjectStatus;
    limit?: number;
    offset?: number;
  }) {
    return this.projectRepository.findMany(params);
  }

  async create(data: {
    organizationId: string;
    name: string;
    description?: string;
    ownerId: string;
  }) {
    return this.projectRepository.create(data);
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: ProjectStatus;
    },
  ) {
    await this.getById(id);

    return this.projectRepository.update(id, data);
  }
}
