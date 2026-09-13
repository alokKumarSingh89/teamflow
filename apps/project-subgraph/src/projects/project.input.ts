import { Field, ID, InputType } from '@nestjs/graphql';

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => ID)
  @IsUUID()
  organizationId!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => ID)
  @IsUUID()
  ownerId!: string;
}
