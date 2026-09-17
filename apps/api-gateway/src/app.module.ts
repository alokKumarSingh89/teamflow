import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticatedDataSource } from './authenticated-data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        introspection: true,
        playground: true,
        // csrfPrevention: true,
      },

      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'user',
              url: 'http://localhost:3001/graphql',
            },
            {
              name: 'project',
              url: 'http://localhost:3002/graphql',
            },
            {
              name: 'task',
              url: 'http://localhost:3003/graphql',
            },
          ],
        }),
        buildService({ url }) {
          return new AuthenticatedDataSource({ url });
        },
      },
    }),
    AuthModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
