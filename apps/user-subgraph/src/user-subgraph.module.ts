import { Module } from '@nestjs/common';
import { UserSubgraphController } from './user-subgraph.controller';
import { UserSubgraphService } from './user-subgraph.service';

@Module({
  imports: [],
  controllers: [UserSubgraphController],
  providers: [UserSubgraphService],
})
export class UserSubgraphModule {}
