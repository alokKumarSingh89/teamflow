import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { MembershipRole, PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.USER_DATABASE_URL;

if (!connectionString) {
  throw new Error('USER_DATABASE_URL is not configured');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const owner = await prisma.user.upsert({
    where: {
      email: 'owner@teamflow.local',
    },
    update: {},
    create: {
      email: 'owner@teamflow.local',
      name: 'TeamFlow Owner',
    },
  });

  const member = await prisma.user.upsert({
    where: {
      email: 'member@teamflow.local',
    },
    update: {},
    create: {
      email: 'member@teamflow.local',
      name: 'TeamFlow Member',
    },
  });

  const organization = await prisma.organization.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000001',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'TeamFlow Demo',
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: owner.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: MembershipRole.OWNER,
    },
    create: {
      userId: owner.id,
      organizationId: organization.id,
      role: MembershipRole.OWNER,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: member.id,
        organizationId: organization.id,
      },
    },
    update: {
      role: MembershipRole.MEMBER,
    },
    create: {
      userId: member.id,
      organizationId: organization.id,
      role: MembershipRole.MEMBER,
    },
  });

  await prisma.team.upsert({
    where: {
      organizationId_name: {
        organizationId: organization.id,
        name: 'Engineering',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Engineering',
    },
  });

  await prisma.team.upsert({
    where: {
      organizationId_name: {
        organizationId: organization.id,
        name: 'Product',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'Product',
    },
  });

  console.log('User domain seed completed.');
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
