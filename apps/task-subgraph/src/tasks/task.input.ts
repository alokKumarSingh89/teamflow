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

import { TaskPriority } from '../generated/prisma/client';

@InputType()
export class CreateTaskInput {
  @Field(() => ID)
  @IsUUID()
  projectId!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @Field(() => ID)
  @IsUUID()
  createdById!: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  dueDate?: Date;
}
