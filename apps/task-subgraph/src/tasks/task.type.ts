import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TaskPriority, TaskStatus } from '../generated/prisma/client';

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
});

@ObjectType('Task')
export class TaskType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  projectId!: string;

  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => TaskPriority)
  priority!: TaskPriority;

  @Field(() => ID, { nullable: true })
  assigneeId!: string | null;

  @Field(() => ID)
  createdById!: string;

  @Field(() => Date, { nullable: true })
  dueDate!: Date | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
