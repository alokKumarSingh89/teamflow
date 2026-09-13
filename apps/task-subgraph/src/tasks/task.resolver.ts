import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TaskService } from './task.service';

import { TaskType } from './task.type';

import { CreateTaskInput } from './task.input';

import { UpdateTaskInput } from './update-task.input';

@Resolver(() => TaskType)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => TaskType)
  async task(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<TaskType> {
    return this.taskService.getById(id);
  }

  @Query(() => [TaskType])
  async tasksByProject(
    @Args('projectId', {
      type: () => ID,
    })
    projectId: string,
  ): Promise<TaskType[]> {
    return this.taskService.listByProject(projectId);
  }

  @Mutation(() => TaskType)
  async createTask(
    @Args('input')
    input: CreateTaskInput,
  ): Promise<TaskType> {
    return this.taskService.create({
      projectId: input.projectId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      assigneeId: input.assigneeId,
      createdById: input.createdById,
      dueDate: input.dueDate,
    });
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Args('input')
    input: UpdateTaskInput,
  ): Promise<TaskType> {
    return this.taskService.update(id, {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
    });
  }
}
