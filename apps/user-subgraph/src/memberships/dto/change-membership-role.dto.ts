import { IsEnum } from 'class-validator';
import { MembershipRole } from '../../generated/prisma/client';

export class ChangeMembershipRoleDto {
  @IsEnum(MembershipRole)
  role!: MembershipRole;
}
