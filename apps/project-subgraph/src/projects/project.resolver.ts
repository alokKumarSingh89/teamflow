import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ProjectService } from './project.service';

import { ProjectType } from './project.type';

import { CreateProjectInput } from './project.input';

import { UpdateProjectInput } from './update-project.input';

@Resolver(() => ProjectType)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => ProjectType)
  async project(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<ProjectType> {
    return this.projectService.getById(id);
  }

  @Query(() => [ProjectType])
  async projectsByOrganization(
    @Args('organizationId', { type: () => ID })
    organizationId: string,
  ): Promise<ProjectType[]> {
    return this.projectService.listByOrganization(organizationId);
  }

  @Mutation(() => ProjectType)
  async createProject(
    @Args('input')
    input: CreateProjectInput,
  ): Promise<ProjectType> {
    return this.projectService.create({
      organizationId: input.organizationId,
      name: input.name,
      description: input.description,
      ownerId: input.ownerId,
    });
  }

  @Mutation(() => ProjectType)
  async updateProject(
    @Args('id', { type: () => ID })
    id: string,
    @Args('input')
    input: UpdateProjectInput,
  ): Promise<ProjectType> {
    return this.projectService.update(id, {
      name: input.name,
      description: input.description,
      status: input.status,
    });
  }
}
