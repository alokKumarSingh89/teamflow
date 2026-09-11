import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OrganizationStatus } from '../generated/prisma/enums';

registerEnumType(OrganizationStatus, {
  name: 'OrganizationStatus',
});

@ObjectType('Organization')
export class OrganizationType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => OrganizationStatus)
  status!: OrganizationStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
