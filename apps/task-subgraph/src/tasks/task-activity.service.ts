import { Injectable } from '@nestjs/common';
import { TaskActivityRepository } from './repositories/task-activity.repository';

@Injectable()
export class TaskActivityService {
  constructor(private readonly repository: TaskActivityRepository) {}

  async listByTask(taskId: string) {
    return this.repository.findByTask(taskId);
  }
}
