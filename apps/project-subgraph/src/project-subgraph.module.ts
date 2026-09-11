import { Module } from '@nestjs/common';
import { ProjectModule } from './projects/project.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ProjectModule],
  controllers: [],
  providers: [],
})
export class ProjectSubgraphModule {}
