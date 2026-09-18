import { Context, Query, Resolver } from '@nestjs/graphql';
import { AuthUserType } from './types/auth-user.type';
import { DatabaseService } from '../database/database.service';
import { UseGuards } from '@nestjs/common';
import { InternalAuthGuard } from './internal-auth.guard';

interface GraphQLContext {
  req: {
    headers: {
      'x-user-id'?: string;
      'x-session-id'?: string;
    };
  };
}
@Resolver(() => AuthUserType)
export class CurrentUserResolver {
  constructor(private readonly databaseService: DatabaseService) {}

  @Query(() => AuthUserType)
  @UseGuards(InternalAuthGuard)
  async me(@Context() context: GraphQLContext): Promise<AuthUserType> {
    const userId = context.req.headers['x-user-id'];
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
