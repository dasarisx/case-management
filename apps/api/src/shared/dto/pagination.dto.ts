import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Records per page', maximum: 100, default: 10 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
}
