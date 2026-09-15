import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Team } from '../generated/prisma/client';
import { TeamRepository } from './repositories/team.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class TeamLoader {
  readonly byOrganizationId: DataLoader<string, Team[]>;

  constructor(private readonly teamRepository: TeamRepository) {
    this.byOrganizationId = new DataLoader<string, Team[]>(
      async (organizationIds) => {
        const teams =
          await this.teamRepository.findManyByOrganizationIds(organizationIds);
        const teamsByOrganizationId = new Map<string, Team[]>();
        for (const organizationId of organizationIds) {
          teamsByOrganizationId.set(organizationId, []);
        }
        for (const team of teams) {
          const current = teamsByOrganizationId.get(team.organizationId);

          if (current) {
            current.push(team);
          }
        }
        return organizationIds.map(
          (organizationId) => teamsByOrganizationId.get(organizationId) ?? [],
        );
      },
    );
  }
}
