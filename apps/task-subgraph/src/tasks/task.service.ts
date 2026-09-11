import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskPriority, TaskStatus } from '../generated/prisma/client';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getById(id: string) {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async list(params?: {
    projectId?: string;
    assigneeId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    limit?: number;
    offset?: number;
  }) {
    return this.taskRepository.findMany(params);
  }

  async create(data: {
    projectId: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string;
    createdById: string;
  }) {
    return this.taskRepository.create(data);
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string | null;
    },
  ) {
    await this.getById(id);

    return this.taskRepository.update(id, data);
  }
}
