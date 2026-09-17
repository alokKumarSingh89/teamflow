import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<{
      req: Request & {
        user?: AuthenticatedUser;
      };
    }>().req;
    if (!request.user) {
      throw new Error('Authenticated user is unavailable');
    }

    return request.user;
  },
);
