import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MembershipModule } from './memberships/membership.module';
import { OrganizationModule } from './organizations/organization.module';
import { TeamModule } from './teams/team.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    OrganizationModule,
    MembershipModule,
    TeamModule,
  ],
})
export class AppModule {}
