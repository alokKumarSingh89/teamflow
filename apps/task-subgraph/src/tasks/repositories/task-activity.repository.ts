import { Injectable } from '@nestjs/common';
import { TaskActivity } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class TaskActivityRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByTask(taskId: string): Promise<TaskActivity[]> {
    return this.database.taskActivity.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    data: {
      taskId: string;
      actorId: string;
      eventType: string;
      metadata?: object;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<TaskActivity> {
    return client.taskActivity.create({
      data: {
        taskId: data.taskId,
        actorId: data.actorId,
        eventType: data.eventType,
        metadata: data.metadata,
      },
    });
  }
}
