import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TeamType } from './team.type';

import { CreateTeamInput } from './team.input';

import { UpdateTeamInput } from './update-team.input';

import { TeamService } from './team.service';

@Resolver(() => TeamType)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => TeamType)
  async team(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<TeamType> {
    return this.teamService.getById(id);
  }

  @Query(() => [TeamType])
  async teamsByOrganization(
    @Args('organizationId', {
      type: () => ID,
    })
    organizationId: string,
  ): Promise<TeamType[]> {
    return this.teamService.listByOrganization(organizationId);
  }

  @Mutation(() => TeamType)
  async createTeam(
    @Args('input')
    input: CreateTeamInput,
  ): Promise<TeamType> {
    return this.teamService.create({
      organizationId: input.organizationId,
      name: input.name,
    });
  }

  @Mutation(() => TeamType)
  async updateTeam(
    @Args('id', {
      type: () => ID,
    })
    id: string,

    @Args('input')
    input: UpdateTeamInput,
  ): Promise<TeamType> {
    return this.teamService.update(id, {
      name: input.name,
      status: input.status,
    });
  }
}
