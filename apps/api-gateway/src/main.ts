import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`API Gateway running on http://localhost:${port}`);

  console.log(`GraphQL Gateway: http://localhost:${port}/graphql`);
}

void bootstrap();
