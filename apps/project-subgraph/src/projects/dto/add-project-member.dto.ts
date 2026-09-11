import { IsUUID } from 'class-validator';

export class AddProjectMemberDto {
  @IsUUID()
  projectId!: string;

  @IsUUID()
  userId!: string;
}
