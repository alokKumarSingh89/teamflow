import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MembershipRole } from '../generated/prisma/enums';

registerEnumType(MembershipRole, {
  name: 'MembershipRole',
});

@ObjectType('Membership')
export class MembershipType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  organizationId!: string;

  @Field(() => MembershipRole)
  role!: MembershipRole;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
