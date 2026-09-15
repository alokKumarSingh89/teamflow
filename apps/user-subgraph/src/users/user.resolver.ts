import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { UserType } from './user.type';
import { CreateUserInput } from './user.input';
import { UpdateUserInput } from './update-user.input';
import { UserService } from './user.service';
import { UserLoader } from './user.loader';
import { UserPaginationArgs } from './pagination/user-pagination.args';
import { UserFilterInput } from './user-filter.input';
import { UserConnectionType } from './pagination/user-connection.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userLoader: UserLoader,
  ) {}

  @Query(() => UserType)
  async user(@Args('id', { type: () => ID }) id: string): Promise<UserType> {
    return this.userService.getById(id);
  }

  @Query(() => UserConnectionType)
  async users(@Args() args: UserPaginationArgs): Promise<UserConnectionType> {
    return this.userService.listPaginated(args);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('input')
    input: CreateUserInput,
  ): Promise<UserType> {
    return this.userService.create({
      email: input.email,
      name: input.name,
    });
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id', { type: () => ID })
    id: string,

    @Args('input')
    input: UpdateUserInput,
  ): Promise<UserType> {
    return this.userService.update(id, {
      name: input.name,
      status: input.status,
    });
  }

  @ResolveReference()
  async resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<UserType> {
    const user = await this.userLoader.byId.load(reference.id);

    if (!user) {
      throw new Error(`User ${reference.id} not found`);
    }

    return user;
  }
}
