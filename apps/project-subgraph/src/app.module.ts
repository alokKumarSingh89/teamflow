import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './projects/project.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, '../schema.gql'),
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
