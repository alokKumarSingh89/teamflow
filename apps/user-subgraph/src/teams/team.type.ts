import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { TeamStatus } from '../generated/prisma/client';

registerEnumType(TeamStatus, {
  name: 'TeamStatus',
});

@ObjectType('Team')
export class TeamType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  organizationId!: string;

  @Field()
  name!: string;

  @Field(() => TeamStatus)
  status!: TeamStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
