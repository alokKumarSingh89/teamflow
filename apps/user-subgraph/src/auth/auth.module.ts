import { Module } from '@nestjs/common';
import { PasswordService } from './password-hasher.service';
import { SessionService } from './session.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  providers: [PasswordService, SessionService],
  exports: [PasswordService, SessionService, JwtModule],
})
export class AuthModule {}
