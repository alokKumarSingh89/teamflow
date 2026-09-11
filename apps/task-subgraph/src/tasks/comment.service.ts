import { Injectable, NotFoundException } from '@nestjs/common';

import { CommentRepository } from './repositories/comment.repository';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async getById(id: string) {
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    return comment;
  }

  async listByTask(taskId: string) {
    await this.ensureTaskExists(taskId);

    return this.commentRepository.findByTask(taskId);
  }

  async create(data: { taskId: string; authorId: string; body: string }) {
    await this.ensureTaskExists(data.taskId);

    return this.commentRepository.create({
      taskId: data.taskId,
      authorId: data.authorId,
      body: data.body.trim(),
    });
  }

  async update(id: string, body: string) {
    await this.getById(id);

    return this.commentRepository.update(id, body.trim());
  }

  async delete(id: string) {
    await this.getById(id);

    return this.commentRepository.delete(id);
  }

  private async ensureTaskExists(taskId: string) {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }
  }
}
