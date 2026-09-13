import {
  Directive,
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { ProjectStatus } from '../generated/prisma/client';

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
});

@ObjectType('Project')
@Directive('@key(fields: "id")')
export class ProjectType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  organizationId!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => ProjectStatus)
  status!: ProjectStatus;

  @Field(() => ID)
  ownerId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
