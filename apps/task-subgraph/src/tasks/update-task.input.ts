import { Field, ID, InputType } from '@nestjs/graphql';

import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { TaskPriority, TaskStatus } from '../generated/prisma/client';

@InputType()
export class UpdateTaskInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => TaskStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field(() => TaskPriority, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  dueDate?: Date;
}
