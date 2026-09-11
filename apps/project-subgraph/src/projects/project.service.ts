import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectStatus } from '../generated/prisma/client';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectMemberRepository } from './repositories/project-member.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly database: DatabaseService,
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

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
    ownerId?: string;
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
    /**
     * Project + initial project member should be
     * created atomically.
     */
    return this.database.$transaction(async (tx) => {
      const project = await this.projectRepository.create(
        {
          organizationId: data.organizationId,
          name: data.name.trim(),
          description: data.description?.trim(),
          ownerId: data.ownerId,
        },
        tx,
      );

      await this.projectMemberRepository.create(
        {
          projectId: project.id,
          userId: data.ownerId,
        },
        tx,
      );

      return project;
    });
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

    return this.projectRepository.update(id, {
      name: data.name?.trim(),
      description: data.description?.trim(),
      status: data.status,
    });
  }
}
