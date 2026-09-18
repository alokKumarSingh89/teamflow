import { BaseContext } from '@apollo/server';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { Injectable } from '@nestjs/common';
import { Plugin } from '@nestjs/apollo';
import { ApolloServerPlugin } from '@apollo/server';
import { GatewayAuthenticationService } from './gateway-authentication.service';
import { GraphQLRequestListener } from '@apollo/server';
import { GraphQLError } from 'graphql/error';
import { FieldNode, Kind, OperationDefinitionNode } from 'graphql';

interface GatewayContext extends BaseContext {
  req: Request & {
    user?: AuthenticatedUser;
  };
  res: Response;
  user?: AuthenticatedUser;
}

const PUBLIC_FIELDS = new Set(['register', 'login']);

@Injectable()
@Plugin()
export class GatewayAuthPlugin implements ApolloServerPlugin<GatewayContext> {
  constructor(
    private readonly authenticationService: GatewayAuthenticationService,
  ) {}

  async requestDidStart(): Promise<GraphQLRequestListener<GatewayContext>> {
    const getRootFields = this.getRootFields;
    const authenticate = this.authenticationService.authenticate;
    return {
      async didResolveOperation({ operation, contextValue }) {
        const rootFields = getRootFields(operation as OperationDefinitionNode);

        const requiresAuthentication = rootFields.some(
          (field) => !PUBLIC_FIELDS.has(field),
        );

        if (!requiresAuthentication) {
          return;
        }

        const user = await authenticate(contextValue.req, contextValue.res);

        if (!user) {
          throw new GraphQLError('Authentication required', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
        }

        contextValue.user = user;
        contextValue.req.user = user;
      },
    };
  }

  private getRootFields(operation: OperationDefinitionNode): string[] {
    return operation.selectionSet.selections
      .filter(
        (selection): selection is FieldNode => selection.kind === Kind.FIELD,
      )
      .map((field) => field.name.value);
  }
}
