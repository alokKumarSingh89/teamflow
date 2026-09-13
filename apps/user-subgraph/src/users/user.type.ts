import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserStatus } from '../generated/prisma/enums';

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field(() => UserStatus)
  status!: UserStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
