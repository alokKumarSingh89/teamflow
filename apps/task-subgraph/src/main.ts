import { NestFactory } from '@nestjs/core';
import { TaskSubgraphModule } from './task-subgraph.module';

async function bootstrap() {
  const app = await NestFactory.create(TaskSubgraphModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
