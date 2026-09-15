import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService) {
    const connectionString = config.getOrThrow('TASK_DATABASE_URL');

    if (!connectionString) {
      throw new Error('USER_DATABASE_URL is not configured');
    }
    const adapter = new PrismaPg({
      connectionString,
    });

    super({
      adapter,
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
      ],
    });
    (this as any).$on('query', (event: any) => {
      console.log('\n========== USER DB ==========');
      console.log(`Duration: ${event.duration}ms`);
      console.log(`SQL:      ${event.query}`);
      console.log(`Params:   ${event.params}`);
      console.log('=============================\n');
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
