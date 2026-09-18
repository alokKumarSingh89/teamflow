import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { AuthenticatedUser } from './auth/types/authenticated-user.type';

interface GatewayContext {
  req: Request;
  res: Response;
  user?: AuthenticatedUser;
}

export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  override willSendRequest({
    request,
    context,
  }: {
    request: any;
    context: Record<string, any>;
  }): void {
    const user = context.user;

    if (!user) {
      return;
    }
    request.http.headers.set('x-user-id', user.id);

    request.http.headers.set('x-session-id', user.sessionId);
  }
}
