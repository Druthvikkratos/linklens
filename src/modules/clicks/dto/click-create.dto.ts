import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClickDto {
  @IsInt()
  linkId!: number;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  referrer!: string | null;
}