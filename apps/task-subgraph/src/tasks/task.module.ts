import { Module } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './task.service';

@Module({
  providers: [TaskRepository, TaskService],
  exports: [TaskService],
})
export class TaskModule {}
