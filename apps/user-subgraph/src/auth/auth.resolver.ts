import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayloadType } from './auth-payload.type';
import { RegisterInput } from './register.input';
import { LoginInput } from './login.input';

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
}
