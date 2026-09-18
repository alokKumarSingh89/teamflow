import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUserType {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;
}
