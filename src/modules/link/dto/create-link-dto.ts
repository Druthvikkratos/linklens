import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsUrl,
  MinDate,
} from 'class-validator';

export class CreateLinkDto {
  @IsUrl(
    {
      protocols: ['https'],
      require_protocol: true,
      require_valid_protocol: true,
    },
    {
      message: 'Website must be a valid HTTPS URL',
    },
  )
  originalUrl!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  expiresAt?: Date;
}
