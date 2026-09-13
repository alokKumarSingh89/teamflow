import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { UserReferenceType } from '../federation/user-reference.type';

@Resolver(() => TaskType)
export class TaskUserResolver {
  @ResolveField(() => UserReferenceType, {
    nullable: true,
  })
  assignee(@Parent() task: TaskType): UserReferenceType | null {
    if (!task.assigneeId) {
      return null;
    }
    return {
      id: task.assigneeId,
    };
  }

  @ResolveField(() => UserReferenceType)
  createdBy(@Parent() task: TaskType): UserReferenceType {
    return {
      id: task.createdById,
    };
  }
}
