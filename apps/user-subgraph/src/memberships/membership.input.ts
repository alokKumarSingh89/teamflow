import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { MembershipRole } from '../generated/prisma/enums';
import { IsEnum, IsUUID } from 'class-validator';

registerEnumType(MembershipRole, {
  name: 'MembershipRole',
});

@InputType()
export class CreateMembershipInput {
  @Field(() => ID)
  @IsUUID()
  userId!: string;

  @Field(() => ID)
  @IsUUID()
  organizationId!: string;

  @Field(() => MembershipRole, {
    defaultValue: MembershipRole.MEMBER,
  })
  @IsEnum(MembershipRole)
  role: MembershipRole = MembershipRole.MEMBER;
}
