import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskType } from '../tasks/task.type';

@ObjectType('Project')
@Directive('@key(fields: "id")')
export class ProjectReferenceType {
  @Field(() => ID)
  id!: string;

  @Field(() => [TaskType])
  tasks?: TaskType[];
}
