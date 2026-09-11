import { IsEnum, IsUUID } from 'class-validator';
import { MembershipRole } from '../../generated/prisma/client';

export class AddMemberDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  organizationId!: string;

  @IsEnum(MembershipRole)
  role: MembershipRole = MembershipRole.MEMBER;
}
