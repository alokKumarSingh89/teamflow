import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProjectType } from './project.type';
import { UserReferenceType } from '../federation/user-reference.type';

@Resolver(() => ProjectType)
export class ProjectOwnerResolver {
  @ResolveField(() => UserReferenceType)
  owner(@Parent() project: ProjectType) {
    return {
      id: project.ownerId,
    };
  }
}
