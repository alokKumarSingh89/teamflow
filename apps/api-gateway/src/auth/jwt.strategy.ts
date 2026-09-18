import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RedisService } from '../redis/redis.service';
import { AuthenticatedUser } from './types/authenticated-user.type';

interface JwtPayload {
  sub: string;
  sid: string;
  iat?: number;
  exp?: number;
}

interface UserSession {
  sessionId: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  status: 'ACTIVE';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly redisService: RedisService) {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload.sub || !payload.sid) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const sessionKey = `teamflow:session:${payload.sid}`;

    const sessionValue = await this.redisService.get(sessionKey);

    if (!sessionValue) {
      throw new UnauthorizedException('Session is no longer active');
    }

    let session: UserSession;

    try {
      session = JSON.parse(sessionValue) as UserSession;
    } catch {
      throw new UnauthorizedException('Invalid session');
    }

    if (session.status !== 'ACTIVE') {
      throw new UnauthorizedException('Session is no longer active');
    }

    if (session.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid authentication session');
    }

    return {
      id: payload.sub,
      sessionId: payload.sid,
    };
  }
}
