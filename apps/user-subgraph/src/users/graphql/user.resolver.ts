import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserType } from './user.type';
import { UserService } from '../user.service';
import { CreateUserInput } from './user.input';
import { UpdateUserInput } from './update-user.input';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType)
  async user(@Args('id', { type: () => ID }) id: string): Promise<UserType> {
    return this.userService.getById(id);
  }
  @Query(() => [UserType])
  async users(): Promise<UserType[]> {
    return this.userService.list();
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
}
