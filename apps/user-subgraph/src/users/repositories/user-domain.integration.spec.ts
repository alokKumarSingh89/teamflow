import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { MembershipRole, PrismaClient } from '../../generated/prisma/client';

describe('User domain database integration', () => {
  let prisma: PrismaClient;
  let pool: Pool;

  beforeAll(async () => {
    const connectionString = process.env.USER_DATABASE_URL;

    if (!connectionString) {
      throw new Error('USER_DATABASE_URL is not configured');
    }

    pool = new Pool({
      connectionString,
    });

    const adapter = new PrismaPg(pool);

    prisma = new PrismaClient({
      adapter,
    });

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it('should create a user', async () => {
    const email = `integration-${Date.now()}@teamflow.local`;

    const user = await prisma.user.create({
      data: {
        email,
        name: 'Integration User',
      },
    });

    expect(user.email).toBe(email);
    expect(user.name).toBe('Integration User');

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });

  it('should enforce unique user email', async () => {
    const email = `unique-${Date.now()}@teamflow.local`;

    const first = await prisma.user.create({
      data: {
        email,
        name: 'First User',
      },
    });

    await expect(
      prisma.user.create({
        data: {
          email,
          name: 'Second User',
        },
      }),
    ).rejects.toThrow();

    await prisma.user.delete({
      where: {
        id: first.id,
      },
    });
  });

  it('should create organization with owner membership atomically', async () => {
    const user = await prisma.user.create({
      data: {
        email: `owner-${Date.now()}@teamflow.local`,
        name: 'Organization Owner',
      },
    });

    const organization = await prisma.$transaction(async (tx) => {
      const created = await tx.organization.create({
        data: {
          name: `Organization ${Date.now()}`,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: created.id,
          role: MembershipRole.OWNER,
        },
      });

      return created;
    });

    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        },
      },
    });

    expect(membership).not.toBeNull();
    expect(membership?.role).toBe(MembershipRole.OWNER);

    await prisma.organization.delete({
      where: {
        id: organization.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  });
});
