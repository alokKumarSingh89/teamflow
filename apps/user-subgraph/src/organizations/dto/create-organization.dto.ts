import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsUUID()
  ownerId!: string;
}
