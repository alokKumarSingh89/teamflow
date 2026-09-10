import { NestFactory } from '@nestjs/core';
import { UserSubgraphModule } from './user-subgraph.module';

async function bootstrap() {
  const app = await NestFactory.create(UserSubgraphModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
