import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { RedisModule } from '../redis/redis.module';
import { GqlAuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    RedisModule,
  ],
  providers: [JwtStrategy, GqlAuthGuard],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
