import { Module } from '@nestjs/common';
import { ProjectSubgraphController } from './project-subgraph.controller';
import { ProjectSubgraphService } from './project-subgraph.service';

@Module({
  imports: [],
  controllers: [ProjectSubgraphController],
  providers: [ProjectSubgraphService],
})
export class ProjectSubgraphModule {}
