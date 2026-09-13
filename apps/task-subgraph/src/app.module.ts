import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './tasks/task.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { UserReferenceType } from './federation/user-reference.type';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,

      autoSchemaFile: {
        federation: 2,
        path: join(__dirname, './schema.gql'),
      },
      sortSchema: true,
      buildSchemaOptions: {
        orphanedTypes: [UserReferenceType],
      },
      graphiql: true,

      context: ({ req, res }: { req: any; res: any }) => ({
        req,
        res,
      }),
    }),
    DatabaseModule,
    TaskModule,
  ],
})
export class AppModule {}
