import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayloadType } from './types/auth-payload.type';
import { RegisterInput } from './register.input';
import { LoginInput } from './login.input';
import { LogoutPayloadType } from './types/logout-payload.type';
import { InternalAuthGuard } from './internal-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';

interface GraphQLContext {
  req: {
    headers: {
      'x-user-id'?: string;
      'x-session-id'?: string;
    };
  };
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => AuthPayloadType)
  async register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthPayloadType> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayloadType)
  async login(@Args('input') input: LoginInput): Promise<AuthPayloadType> {
    return this.authService.login(input);
  }

  @Mutation(() => LogoutPayloadType)
  @UseGuards(InternalAuthGuard)
  async logout(@Context() context: GraphQLContext): Promise<LogoutPayloadType> {
    const userId = context.req.headers['x-user-id'];

    const sessionId = context.req.headers['x-session-id'];

    if (!userId || !sessionId) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.authService.logout(userId, sessionId);
  }
}
