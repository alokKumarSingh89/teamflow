import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LabelRepository } from './repositories/label.repository';

@Injectable()
export class LabelService {
  constructor(private readonly repository: LabelRepository) {}

  async getById(id: string) {
    const label = await this.repository.findById(id);

    if (!label) {
      throw new NotFoundException(`Label ${id} not found`);
    }

    return label;
  }

  async listByProject(projectId: string) {
    return this.repository.findByProject(projectId);
  }

  async create(data: { projectId: string; name: string; color: string }) {
    const name = data.name.trim();

    const existing = await this.repository.findByProjectAndName(
      data.projectId,
      name,
    );

    if (existing) {
      throw new ConflictException(`Label "${name}" already exists`);
    }

    return this.repository.create({
      projectId: data.projectId,
      name,
      color: data.color.trim(),
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      color?: string;
    },
  ) {
    await this.getById(id);

    return this.repository.update(id, {
      name: data.name?.trim(),
      color: data.color?.trim(),
    });
  }
}
