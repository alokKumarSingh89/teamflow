import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TeamStatus } from '../generated/prisma/enums';

@InputType()
export class UpdateTeamInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name?: string;

  @Field(() => TeamStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus;
}
