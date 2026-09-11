import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Task, TaskPriority, TaskStatus } from '../../generated/prisma/client';

@Injectable()
export class TaskRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: string): Promise<Task | null> {
    return this.database.task.findUnique({
      where: {
        id,
      },
    });
  }

  async findMany(params?: {
    projectId?: string;
    assigneeId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    limit?: number;
    offset?: number;
  }): Promise<Task[]> {
    return this.database.task.findMany({
      where: {
        projectId: params?.projectId,
        assigneeId: params?.assigneeId,
        status: params?.status,
        priority: params?.priority,
      },
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    projectId: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string;
    createdById: string;
  }): Promise<Task> {
    return this.database.task.create({
      data,
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
    },
  ): Promise<Task> {
    return this.database.task.update({
      where: {
        id,
      },
      data,
    });
  }
}
