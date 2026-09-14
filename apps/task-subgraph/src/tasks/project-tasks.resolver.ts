import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { ProjectReferenceType } from '../federation/project-reference.type';
import { TaskType } from './task.type';

@Resolver(() => ProjectReferenceType)
export class ProjectTasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @ResolveField(() => [TaskType])
  async tasks(@Parent() project: ProjectReferenceType): Promise<TaskType[]> {
    return this.taskService.listByProject(project.id);
  }
}
