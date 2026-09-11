import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [DatabaseModule, TaskModule],
})
export class AppModule {}
