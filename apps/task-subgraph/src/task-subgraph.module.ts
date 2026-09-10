import { Module } from '@nestjs/common';
import { TaskSubgraphController } from './task-subgraph.controller';
import { TaskSubgraphService } from './task-subgraph.service';

@Module({
  imports: [],
  controllers: [TaskSubgraphController],
  providers: [TaskSubgraphService],
})
export class TaskSubgraphModule {}
