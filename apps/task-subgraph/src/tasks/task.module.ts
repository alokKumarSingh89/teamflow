import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { TaskRepository } from './repositories/task.repository';
import { CommentRepository } from './repositories/comment.repository';
import { TaskActivityRepository } from './repositories/task-activity.repository';

import { TaskService } from './task.service';
import { CommentService } from './comment.service';
import { TaskActivityService } from './task-activity.service';
import { TaskResolver } from './task.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [
    TaskRepository,
    CommentRepository,
    TaskActivityRepository,

    TaskService,
    CommentService,
    TaskActivityService,
    TaskResolver,
  ],
  exports: [TaskService, CommentService, TaskActivityService],
})
export class TaskModule {}
