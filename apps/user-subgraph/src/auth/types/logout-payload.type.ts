import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutPayloadType {
  @Field()
  success!: boolean;
}
