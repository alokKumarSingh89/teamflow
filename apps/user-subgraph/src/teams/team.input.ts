import { Field, ID, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class CreateTeamInput {
  @Field(() => ID)
  @IsUUID()
  organizationId!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;
}
