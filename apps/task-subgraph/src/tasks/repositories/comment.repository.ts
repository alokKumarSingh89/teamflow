import { Injectable } from '@nestjs/common';
import { Comment } from '../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';
import { PrismaTransactionClient } from '../../database/prisma-transaction';

@Injectable()
export class CommentRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(
    id: string,
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Comment | null> {
    return client.comment.findUnique({
      where: {
        id,
      },
    });
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return this.database.comment.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(
    data: {
      taskId: string;
      authorId: string;
      body: string;
    },
    client: PrismaTransactionClient | DatabaseService = this.database,
  ): Promise<Comment> {
    return client.comment.create({
      data,
    });
  }

  async update(id: string, body: string): Promise<Comment> {
    return this.database.comment.update({
      where: {
        id,
      },
      data: {
        body,
      },
    });
  }

  async delete(id: string): Promise<Comment> {
    return this.database.comment.delete({
      where: {
        id,
      },
    });
  }
}
