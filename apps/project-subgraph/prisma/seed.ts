import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PrismaClient, ProjectStatus } from '../src/generated/prisma/client';

const connectionString = process.env.PROJECT_DATABASE_URL;

if (!connectionString) {
  throw new Error('PROJECT_DATABASE_URL is not configured');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const organizationId = '00000000-0000-0000-0000-000000000001';

  const ownerId = '00000000-0000-0000-0000-000000000002';

  const project = await prisma.project.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000101',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      organizationId,
      name: 'TeamFlow Platform',
      description: 'Main TeamFlow development project',
      ownerId,
      status: ProjectStatus.ACTIVE,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: ownerId,
      },
    },
    update: {},
    create: {
      projectId: project.id,
      userId: ownerId,
    },
  });

  await prisma.label.upsert({
    where: {
      projectId_name: {
        projectId: project.id,
        name: 'backend',
      },
    },
    update: {},
    create: {
      projectId: project.id,
      name: 'backend',
      color: '#2563EB',
    },
  });

  await prisma.label.upsert({
    where: {
      projectId_name: {
        projectId: project.id,
        name: 'frontend',
      },
    },
    update: {},
    create: {
      projectId: project.id,
      name: 'frontend',
      color: '#7C3AED',
    },
  });

  console.log('Project domain seed completed.');
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
