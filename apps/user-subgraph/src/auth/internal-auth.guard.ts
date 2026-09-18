import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface DownstreamUser {
  id: string;
  sessionId: string;
}

interface InternalRequest {
  headers: {
    'x-user-id'?: string;
    'x-session-id'?: string;
  };
}
@Injectable()
export class InternalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<{
      req: Request;
    }>().req;

    const userId = request.headers['x-user-id'];

    const sessionId = request.headers['x-session-id'];

    if (typeof userId !== 'string' || typeof sessionId !== 'string') {
      throw new UnauthorizedException('Authenticated user context is missing');
    }

    return true;
  }
}
