import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './projects/project.module';

@Module({
  imports: [DatabaseModule, ProjectModule],
})
export class AppModule {}
