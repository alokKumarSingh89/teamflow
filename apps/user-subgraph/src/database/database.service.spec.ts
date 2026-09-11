import { describe, expect, it } from 'vitest';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

describe('User database connection', () => {
  it('should connect to PostgreSQL', async () => {
    const adapter = new PrismaPg({
      connectionString: process.env.USER_DATABASE_URL,
    });

    const prisma = new PrismaClient({
      adapter,
    });

    await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();

    await prisma.$disconnect();
  });
});
