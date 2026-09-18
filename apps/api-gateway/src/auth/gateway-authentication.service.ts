import { Injectable } from '@nestjs/common';
import passport from 'passport';
import type { Request, Response } from 'express';

import { AuthenticatedUser } from './types/authenticated-user.type';

@Injectable()
export class GatewayAuthenticationService {
  async authenticate(
    req: Request,
    res: Response,
  ): Promise<AuthenticatedUser | undefined> {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    if (!authorization.startsWith('Bearer ')) {
      return undefined;
    }

    return new Promise<AuthenticatedUser | undefined>((resolve, reject) => {
      const authenticate = passport.authenticate(
        'jwt',
        {
          session: false,
        },
        (error: unknown, user: AuthenticatedUser | false | null) => {
          if (error) {
            reject(error);
            return;
          }

          if (!user) {
            resolve(undefined);
            return;
          }

          resolve(user);
        },
      );

      authenticate(req, res, (error: unknown) => {
        if (error) {
          reject(error);
        }
      });
    });
  }
}
