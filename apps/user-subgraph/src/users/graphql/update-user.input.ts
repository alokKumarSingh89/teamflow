import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserStatus } from '../../generated/prisma/enums';

@InputType()
export class UpdateUserInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @Field(() => UserStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
