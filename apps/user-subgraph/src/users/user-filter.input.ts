import { Field, InputType } from '@nestjs/graphql';

import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { UserStatus } from '../generated/prisma/client';

@InputType()
export class UserFilterInput {
  @Field(() => UserStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
