import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { SESSION_TTL_SECONDS, UserSession } from './types/session.type';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService) {}

  private getSessionKey(sessionId: string): string {
    return `teamflow:session:${sessionId}`;
  }
  async create(userId: string): Promise<UserSession> {
    const sessionId = randomUUID();

    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + SESSION_TTL_SECONDS * 1000,
    );

    const session: UserSession = {
      sessionId,
      userId,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'ACTIVE',
    };
    await this.redisService.set(
      this.getSessionKey(sessionId),
      JSON.stringify(session),
      SESSION_TTL_SECONDS,
    );

    return session;
  }
  async findById(sessionId: string): Promise<UserSession | null> {
    const value = await this.redisService.get(this.getSessionKey(sessionId));
    if (!value) {
      return null;
    }

    return JSON.parse(value) as UserSession;
  }
  async revoke(sessionId: string): Promise<void> {
    await this.redisService.delete(this.getSessionKey(sessionId));
  }

  async isActive(sessionId: string): Promise<boolean> {
    const session = await this.findById(sessionId);
    return session?.status === 'ACTIVE';
  }
  async revokeForUser(sessionId: string, userId: string): Promise<void> {
    const session = await this.findById(sessionId);
    if (!session) {
      return;
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException('Invalid authentication session');
    }

    await this.revoke(sessionId);
  }
}
