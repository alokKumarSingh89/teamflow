import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<{ req: Request }>().req;
    if (!request) {
      throw new UnauthorizedException('GraphQL request context is unavailable');
    }

    return request;
  }
}
