import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UserReferenceType {
  @Field(() => ID)
  @Directive('@external')
  id!: string;
}
