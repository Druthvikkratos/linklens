import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MinDate,
  MinLength,
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

  @IsString()
  @IsUrl({}, { message: 'The link must be a valid URL.' })
  javascript!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  expiresAt?: Date;
}
