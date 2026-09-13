import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskPriority, TaskStatus } from '../generated/prisma/client';

import { DatabaseService } from '../database/database.service';
import { TaskRepository } from './repositories/task.repository';
import { TaskActivityRepository } from './repositories/task-activity.repository';

@Injectable()
export class TaskService {
  constructor(
    private readonly database: DatabaseService,
    private readonly taskRepository: TaskRepository,
    private readonly activityRepository: TaskActivityRepository,
  ) {}

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
    dueDate?: Date;
  }) {
    return this.database.$transaction(async (tx) => {
      const task = await this.taskRepository.create(
        {
          ...data,
          title: data.title.trim(),
          description: data.description?.trim(),
        },
        tx,
      );

      await this.activityRepository.create(
        {
          taskId: task.id,
          actorId: data.createdById,
          eventType: 'TASK_CREATED',
          metadata: {
            title: task.title,
          },
        },
        tx,
      );

      return task;
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string | null;
      dueDate?: Date | null;
    },
  ) {
    const existing = await this.getById(id);

    return this.database.$transaction(async (tx) => {
      const updated = await this.taskRepository.update(
        id,
        {
          ...data,
          title: data.title?.trim(),
          description: data.description?.trim(),
        },
        tx,
      );

      await this.activityRepository.create(
        {
          taskId: id,
          eventType: 'TASK_UPDATED',
          metadata: {
            previousStatus: existing.status,
            newStatus: updated.status,
            previousAssigneeId: existing.assigneeId,
            newAssigneeId: updated.assigneeId,
          },
        },
        tx,
      );

      return updated;
    });
  }
  async listByProject(projectId: string) {
    return this.taskRepository.findByProject(projectId);
  }
}
