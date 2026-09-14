import { Field, InputType } from '@nestjs/graphql';

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { UserStatus } from '../generated/prisma/client';

@InputType()
export class UserFilterInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => UserStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
