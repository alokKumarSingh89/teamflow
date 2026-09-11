import { Module } from '@nestjs/common';
import { MembershipModule } from '../memberships/membership.module';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';

@Module({
  imports: [MembershipModule],
  providers: [
    OrganizationRepository,
    OrganizationService,
    OrganizationResolver,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
