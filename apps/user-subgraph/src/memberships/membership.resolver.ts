import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateMembershipInput } from './membership.input';

import { MembershipType } from './membership.type';
import { MembershipService } from './membership.service';
import { MembershipRole } from '../generated/prisma/enums';

@Resolver(() => MembershipType)
export class MembershipResolver {
  constructor(private readonly membershipService: MembershipService) {}

  @Query(() => MembershipType)
  async membership(
    @Args('id', { type: () => ID })
    id: string,
  ): Promise<MembershipType> {
    return this.membershipService.getById(id);
  }

  @Query(() => [MembershipType])
  async membershipsByUser(
    @Args('userId', { type: () => ID })
    userId: string,
  ): Promise<MembershipType[]> {
    return this.membershipService.listByUser(userId);
  }

  @Query(() => [MembershipType])
  async membershipsByOrganization(
    @Args('organizationId', { type: () => ID })
    organizationId: string,
  ): Promise<MembershipType[]> {
    return this.membershipService.listByOrganization(organizationId);
  }

  @Mutation(() => MembershipType)
  async createMembership(
    @Args('input')
    input: CreateMembershipInput,
  ): Promise<MembershipType> {
    return this.membershipService.create({
      userId: input.userId,
      organizationId: input.organizationId,
      role: input.role,
    });
  }

  @Mutation(() => MembershipType)
  async updateMembershipRole(
    @Args('id', { type: () => ID })
    id: string,

    @Args('role', {
      type: () => MembershipRole,
    })
    role: MembershipRole,
  ): Promise<MembershipType> {
    return this.membershipService.updateRole(id, role);
  }

  @Mutation(() => MembershipType)
  async deleteMembership(
    @Args('id', { type: () => ID })
    id: string,
  ): Promise<MembershipType> {
    return this.membershipService.remove(id);
  }
}
