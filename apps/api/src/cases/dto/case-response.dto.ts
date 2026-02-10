import { ApiProperty } from '@nestjs/swagger';
import { CaseStageDto, CaseStatusDto } from './cases.enums';

export class CaseResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  customerId!: number;

  @ApiProperty()
  loanId!: number;

  @ApiProperty()
  dpd!: number;

  @ApiProperty({ enum: CaseStageDto })
  stage!: CaseStageDto;

  @ApiProperty({ enum: CaseStatusDto })
  status!: CaseStatusDto;

  @ApiProperty({ required: false })
  assignedTo?: string;

  @ApiProperty({ required: false })
  actionsCount?: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
