import { Module } from '@nestjs/common';
import { MembershipModule } from '../memberships/membership.module';
import { OrganizationRepository } from './repositories/organization.repository';
import { OrganizationService } from './organization.service';

@Module({
  imports: [MembershipModule],
  providers: [OrganizationRepository, OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
