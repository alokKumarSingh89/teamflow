import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './projects/project.module';
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
      buildSchemaOptions: {
        orphanedTypes: [UserReferenceType],
      },
      sortSchema: true,
      graphiql: true,
      context: ({ req, res }: { req: any; res: any }) => ({
        req,
        res,
      }),
    }),
    DatabaseModule,
    ProjectModule,
  ],
})
export class AppModule {}
