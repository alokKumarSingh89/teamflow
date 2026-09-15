import { ArgsType, Field, Int } from '@nestjs/graphql';

import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { UserFilterInput } from '../user-filter.input';

@ArgsType()
export class UserPaginationArgs {
  @Field(() => Int, {
    nullable: true,
    defaultValue: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  first?: number;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  after?: string;

  @Field(() => UserFilterInput, {
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilterInput)
  filter?: UserFilterInput;
}
