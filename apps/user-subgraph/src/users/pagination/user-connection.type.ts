import { Field, ObjectType } from '@nestjs/graphql';

import { PageInfoType } from './page-info.type';
import { UserEdgeType } from './user-edge.type';

@ObjectType()
export class UserConnectionType {
  @Field(() => [UserEdgeType])
  edges!: UserEdgeType[];

  @Field(() => PageInfoType)
  pageInfo!: PageInfoType;
}
