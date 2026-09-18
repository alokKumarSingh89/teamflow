import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { RedisModule } from '../redis/redis.module';
import { GqlAuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { GatewayAuthenticationService } from './gateway-authentication.service';
import { GatewayAuthPlugin } from './gateway-auth.plugin';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    RedisModule,
  ],
  providers: [
    JwtStrategy,
    GqlAuthGuard,
    GatewayAuthenticationService,
    GatewayAuthPlugin,
  ],
  exports: [GatewayAuthenticationService],
})
export class AuthModule {}
