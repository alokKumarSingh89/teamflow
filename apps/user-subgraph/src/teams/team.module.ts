import { Module } from '@nestjs/common';
import { TeamRepository } from './repositories/team.repository';
import { TeamService } from './team.service';

@Module({
  providers: [TeamRepository, TeamService],
  exports: [TeamService],
})
export class TeamModule {}
