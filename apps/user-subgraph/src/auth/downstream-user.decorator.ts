import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DownstreamUser } from './downstream-user.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

export const DownstreamUserD = createParamDecorator(
  (_data: unknown, context: ExecutionContext): DownstreamUser => {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<{
      req: Request;
    }>().req;

    const userId = request.headers.get('x-user-id');

    const sessionId = request.headers.get('x-session-id');

    if (typeof userId !== 'string' || typeof sessionId !== 'string') {
      throw new UnauthorizedException('Authenticated user context is missing');
    }

    return {
      id: userId,
      sessionId,
    };
  },
);
