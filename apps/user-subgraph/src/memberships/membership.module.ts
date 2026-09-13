import { Module } from '@nestjs/common';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';

@Module({
  providers: [MembershipRepository, MembershipService, MembershipResolver],
  exports: [MembershipService, MembershipRepository],
})
export class MembershipModule {}
