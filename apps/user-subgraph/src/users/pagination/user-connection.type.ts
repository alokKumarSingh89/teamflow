import { Field, ObjectType } from '@nestjs/graphql';

import { PageInfoType } from './page-info.type';
import { UserType } from '../../users/user.type';

@ObjectType()
export class UserEdgeType {
  @Field(() => String)
  cursor!: string;

  @Field(() => UserType)
  node!: UserType;
}

@ObjectType()
export class UserConnectionType {
  @Field(() => [UserEdgeType])
  edges!: UserEdgeType[];

  @Field(() => [UserType])
  nodes!: UserType[];

  @Field(() => PageInfoType)
  pageInfo!: PageInfoType;
}
