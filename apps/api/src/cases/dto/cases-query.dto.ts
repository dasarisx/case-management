import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CaseStageDto, CaseStatusDto } from './cases.enums';

export class CasesQueryDto {
  @IsOptional()
  @IsEnum(CaseStatusDto)
  status?: CaseStatusDto;

  @IsOptional()
  @IsEnum(CaseStageDto)
  stage?: CaseStageDto;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  dpdMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  dpdMax?: number;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
