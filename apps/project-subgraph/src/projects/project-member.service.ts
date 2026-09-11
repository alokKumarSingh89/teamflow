import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectMemberRepository } from './repositories/project-member.repository';

@Injectable()
export class ProjectMemberService {
  constructor(private readonly repository: ProjectMemberRepository) {}

  async getById(id: string) {
    const member = await this.repository.findById(id);

    if (!member) {
      throw new NotFoundException(`Project member ${id} not found`);
    }

    return member;
  }

  async listByProject(projectId: string) {
    return this.repository.findByProject(projectId);
  }

  async addMember(data: { projectId: string; userId: string }) {
    const existing = await this.repository.findByProjectAndUser(
      data.projectId,
      data.userId,
    );

    if (existing) {
      throw new ConflictException('User is already a member of this project');
    }

    return this.repository.create(data);
  }

  async removeMember(id: string) {
    await this.getById(id);

    return this.repository.delete(id);
  }
}
