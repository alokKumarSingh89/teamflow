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
    const connectionString = config.getOrThrow('USER_DATABASE_URL');

    if (!connectionString) {
      throw new Error('USER_DATABASE_URL is not configured');
    }
    const adapter = new PrismaPg({
      connectionString,
    });

    super({
      adapter,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
