import { Field, ObjectType } from '@nestjs/graphql';

import { AuthUserType } from './auth-user.type';

@ObjectType()
export class AuthPayloadType {
  @Field()
  accessToken!: string;

  @Field(() => AuthUserType)
  user!: AuthUserType;
}
