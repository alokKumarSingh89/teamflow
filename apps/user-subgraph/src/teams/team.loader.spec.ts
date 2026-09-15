import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TeamLoader } from './team.loader';
import { TeamRepository } from './repositories/team.repository';

describe('TeamLoader', () => {
  let loader: TeamLoader;

  const teamRepository = {
    findManyByOrganizationIds: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    loader = new TeamLoader(teamRepository as unknown as TeamRepository);
  });

  it('should batch organizations into one repository call', async () => {
    const backend = {
      id: 'team-1',
      organizationId: 'org-1',
      name: 'Backend',
    };

    const frontend = {
      id: 'team-2',
      organizationId: 'org-2',
      name: 'Frontend',
    };

    teamRepository.findManyByOrganizationIds.mockResolvedValue([
      frontend,
      backend,
    ]);

    const [org1Teams, org2Teams] = await Promise.all([
      loader.byOrganizationId.load('org-1'),
      loader.byOrganizationId.load('org-2'),
    ]);

    expect(teamRepository.findManyByOrganizationIds).toHaveBeenCalledTimes(1);

    expect(teamRepository.findManyByOrganizationIds).toHaveBeenCalledWith([
      'org-1',
      'org-2',
    ]);

    expect(org1Teams).toEqual([backend]);

    expect(org2Teams).toEqual([frontend]);
  });

  it('should return an empty array when organization has no teams', async () => {
    teamRepository.findManyByOrganizationIds.mockResolvedValue([]);

    const teams = await loader.byOrganizationId.load('org-empty');

    expect(teams).toEqual([]);
  });

  it('should cache duplicate organization loads', async () => {
    const backend = {
      id: 'team-1',
      organizationId: 'org-1',
      name: 'Backend',
    };

    teamRepository.findManyByOrganizationIds.mockResolvedValue([backend]);

    const [first, second] = await Promise.all([
      loader.byOrganizationId.load('org-1'),
      loader.byOrganizationId.load('org-1'),
    ]);

    expect(first).toEqual([backend]);
    expect(second).toEqual([backend]);

    expect(teamRepository.findManyByOrganizationIds).toHaveBeenCalledTimes(1);
  });
});
