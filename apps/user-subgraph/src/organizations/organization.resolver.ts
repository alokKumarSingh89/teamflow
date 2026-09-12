import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { OrganizationType } from './organization.type';
import { OrganizationService } from './organization.service';
import { CreateOrganizationInput } from './organization.input';
import { TeamService } from '../teams/team.service';
import { TeamType } from '../teams/team.type';

@Resolver(() => OrganizationType)
export class OrganizationResolver {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly teamService: TeamService,
  ) {}

  @Query(() => OrganizationType)
  async organization(
    @Args('id', { type: () => ID })
    id: string,
  ): Promise<OrganizationType> {
    return this.organizationService.getById(id);
  }

  @Query(() => [OrganizationType])
  async organizations(): Promise<OrganizationType[]> {
    return this.organizationService.list();
  }

  @Mutation(() => OrganizationType)
  async createOrganization(
    @Args('input')
    input: CreateOrganizationInput,
  ): Promise<OrganizationType> {
    return this.organizationService.createOrganization({
      name: input.name,
      ownerId: input.ownerId,
    });
  }
  @ResolveField(() => [TeamType])
  async teams(@Parent() organization: OrganizationType): Promise<TeamType[]> {
    return this.teamService.listByOrganization(organization.id);
  }
}
