import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PasswordService } from './password-hasher.service';
import { SessionService } from './session.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './register.input';
import { AuthPayloadType } from './auth-payload.type';
import { LoginInput } from './login.input';

interface AccessTokenPayload {
  sub: string;
  sid: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
  ) {}
  async register(input: RegisterInput): Promise<AuthPayloadType> {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    const existingUser = await this.databaseService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }
    const passwordHash = await this.passwordService.hash(input.password);
    const user = await this.databaseService.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    const session = await this.sessionService.create(user.id);
    const accessToken = await this.createAccessToken(
      user.id,
      session.sessionId,
    );
    return {
      accessToken,
      user,
    };
  }
  async login(input: LoginInput): Promise<AuthPayloadType> {
    const email = input.email.trim().toLowerCase();

    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        status: true,
      },
    });
    /*
     * Do not reveal whether the email exists.
     *
     * This avoids creating an easy user-enumeration endpoint.
     */
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }
    const passwordValid = await this.passwordService.verify(
      user.passwordHash,
      input.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const session = await this.sessionService.create(user.id);

    const accessToken = await this.createAccessToken(
      user.id,
      session.sessionId,
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private async createAccessToken(
    userId: string,
    sessionId: string,
  ): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: userId,
      sid: sessionId,
    };

    return this.jwtService.signAsync(payload);
  }
}
