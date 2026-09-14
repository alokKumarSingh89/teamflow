import { Field, ObjectType } from '@nestjs/graphql';

import { UserType } from '../user.type';

@ObjectType()
export class UserEdgeType {
  @Field(() => UserType)
  node!: UserType;

  @Field()
  cursor!: string;
}
