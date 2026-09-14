import { ArgsType, Field, Int } from '@nestjs/graphql';

import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  after?: string;
}
