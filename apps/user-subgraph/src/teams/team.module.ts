import { Module } from '@nestjs/common';
import { TeamRepository } from './repositories/team.repository';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';
import { TeamLoader } from './team.loader';

@Module({
  providers: [TeamRepository, TeamService, TeamResolver, TeamLoader],
  exports: [TeamService, TeamLoader],
})
export class TeamModule {}
