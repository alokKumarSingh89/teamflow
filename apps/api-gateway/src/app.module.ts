import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticatedDataSource } from './authenticated-data-source';
import { GatewayAuthenticationService } from './auth/gateway-authentication.service';
import { formatGraphQLError } from './graphql-error.formatter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [AuthModule],
      inject: [GatewayAuthenticationService],
      useFactory: (
        authenticationService: GatewayAuthenticationService,
      ): ApolloGatewayDriverConfig => ({
        server: {
          debug: process.env.NODE_ENV !== 'production',
          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }),
          formatError: formatGraphQLError,
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'user-subgraph',
                url:
                  process.env.USER_SUBGRAPH_URL ??
                  'http://localhost:3001/graphql',
              },
              {
                name: 'project-subgraph',
                url:
                  process.env.PROJECT_SUBGRAPH_URL ??
                  'http://localhost:3002/graphql',
              },
              {
                name: 'task-subgraph',
                url:
                  process.env.TASK_SUBGRAPH_URL ??
                  'http://localhost:3003/graphql',
              },
            ],
          }),
          buildService({ url }) {
            return new AuthenticatedDataSource({
              url,
            });
          },
        },
      }),
    }),
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
