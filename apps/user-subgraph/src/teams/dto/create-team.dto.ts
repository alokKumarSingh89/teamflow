import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsUUID()
  organizationId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;
}
