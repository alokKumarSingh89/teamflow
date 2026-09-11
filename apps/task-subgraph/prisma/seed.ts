import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import {
  PrismaClient,
  TaskPriority,
  TaskStatus,
} from '../src/generated/prisma/client';

const connectionString = process.env.TASK_DATABASE_URL;

if (!connectionString) {
  throw new Error('TASK_DATABASE_URL is not configured');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const projectId = '00000000-0000-0000-0000-000000000101';

  const userId = '00000000-0000-0000-0000-000000000002';

  const task = await prisma.task.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000201',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      projectId,
      title: 'Implement GraphQL API',
      description: 'Implement TeamFlow GraphQL API',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assigneeId: userId,
      createdById: userId,
    },
  });

  await prisma.taskActivity.create({
    data: {
      taskId: task.id,
      actorId: userId,
      eventType: 'TASK_CREATED',
      metadata: {
        source: 'seed',
      },
    },
  });

  console.log('Task domain seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
