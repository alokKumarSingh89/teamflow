import { NestFactory } from '@nestjs/core';
import { ProjectSubgraphModule } from './project-subgraph.module';

async function bootstrap() {
  const app = await NestFactory.create(ProjectSubgraphModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
