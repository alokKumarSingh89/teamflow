import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import * as argon2 from 'argon2';

const connectionString = process.env.USER_DATABASE_URL;

if (!connectionString) {
  throw new Error('USER_DATABASE_URL is required');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const DEVELOPMENT_PASSWORD = 'TeamFlow@Dev2026!';

async function main(): Promise<void> {
  const passwordHash = await argon2.hash(DEVELOPMENT_PASSWORD, {
    type: argon2.argon2id,
  });

  const result = await prisma.user.updateMany({
    where: {
      passwordHash: null,
    },
    data: {
      passwordHash,
    },
  });

  console.log(`Updated ${result.count} users.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
