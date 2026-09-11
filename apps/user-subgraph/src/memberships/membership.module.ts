import { Module } from '@nestjs/common';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './membership.service';

@Module({
  providers: [MembershipRepository, MembershipService],
  exports: [MembershipService, MembershipRepository],
})
export class MembershipModule {}
