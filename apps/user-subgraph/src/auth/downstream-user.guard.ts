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

@Injectable()
export class DownstreamUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<{
      req: Request;
    }>().req;

    const userId = request.headers.get('x-user-id');

    const sessionId = request.headers.get('x-session-id');

    if (typeof userId !== 'string' || typeof sessionId !== 'string') {
      throw new UnauthorizedException('Authenticated user context is missing');
    }

    return true;
  }
}
