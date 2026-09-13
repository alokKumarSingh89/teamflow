import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class CreateOrganizationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @Field(() => String)
  @IsUUID()
  ownerId!: string;
}
