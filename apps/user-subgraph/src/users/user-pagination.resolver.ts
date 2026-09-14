import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserConnectionType } from './pagination/user-connection.type';
import { UserPaginationArgs } from './pagination/user-pagination.args';
import { UserFilterInput } from './user-filter.input';

@Resolver()
export class UserPaginationResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserConnectionType)
  async usersConnection(
    @Args() pagination: UserPaginationArgs,
    @Args('filter', {
      nullable: true,
    })
    filter?: UserFilterInput,
  ): Promise<UserConnectionType> {
    const first = pagination.first ?? 20;

    const users = await this.userService.listPaginated({
      first,
      after: pagination.after,
      search: filter?.search,
      email: filter?.email,
      status: filter?.status,
    });

    const hasNextPage = users.length > first;

    const pageUsers = hasNextPage ? users.slice(0, first) : users;

    const edges = pageUsers.map((user) => ({
      node: user,
      cursor: user.id,
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: Boolean(pagination.after),
        startCursor: edges[0]?.cursor ?? null,
        endCursor: edges.at(-1)?.cursor ?? null,
      },
    };
  }
}
