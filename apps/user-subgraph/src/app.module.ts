import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MembershipModule } from './memberships/membership.module';
import { OrganizationModule } from './organizations/organization.module';
import { TeamModule } from './teams/team.module';
import { UserModule } from './users/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserResolver } from './users/graphql/user.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      context: ({ req }) => ({
        req,
      }),
    }),
    DatabaseModule,
    UserModule,
    OrganizationModule,
    MembershipModule,
    TeamModule,
  ],
  providers: [UserResolver],
})
export class AppModule {}
