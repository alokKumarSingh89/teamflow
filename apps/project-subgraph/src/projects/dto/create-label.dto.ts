import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateLabelDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  color!: string;
}
