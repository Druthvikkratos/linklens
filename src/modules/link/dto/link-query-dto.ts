import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class LinkQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 50;
   @IsOptional() @IsIn(['shortCode', 'createdAt']) sortField?: string;
  @IsOptional() @IsIn(['asc', 'desc']) sortDir?: 'asc' | 'desc';
}
