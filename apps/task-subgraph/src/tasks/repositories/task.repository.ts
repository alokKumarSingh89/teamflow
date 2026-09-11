import { Injectable } from '@nestjs/common';
import { Task, TaskPriority, TaskStatus } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class TaskRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Task | null> {
    return client.task.findUnique({
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

  async create(
    data: {
      projectId: string;
      title: string;
      description?: string;
      priority?: TaskPriority;
      assigneeId?: string;
      createdById: string;
      dueDate?: Date;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Task> {
    return client.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        assigneeId: data.assigneeId,
        createdById: data.createdById,
        dueDate: data.dueDate,
      },
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
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Task> {
    return client.task.update({
      where: {
        id,
      },
      data,
    });
  }
}
