import { Module } from '@nestjs/common';
import { TeamRepository } from './repositories/team.repository';
import { TeamService } from './team.service';
import { TeamResolver } from './team.resolver';

@Module({
  providers: [TeamRepository, TeamService, TeamResolver],
  exports: [TeamService],
})
export class TeamModule {}
