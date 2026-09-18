import { Module } from '@nestjs/common';
import { PasswordService } from './password-hasher.service';
import { SessionService } from './session.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { RedisModule } from '../redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { CurrentUserResolver } from './current-user.resolver';
import { InternalAuthGuard } from './internal-auth.guard';

@Module({
  imports: [
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get(
            'JWT_ACCESS_EXPIRES_IN',
            '15m',
          ) as StringValue,
        },
      }),
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    PasswordService,
    SessionService,
    CurrentUserResolver,
    InternalAuthGuard,
  ],
  exports: [AuthService, PasswordService, SessionService, JwtModule],
})
export class AuthModule {}
