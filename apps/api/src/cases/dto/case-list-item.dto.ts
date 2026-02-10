import { ApiProperty } from '@nestjs/swagger';
import { CaseStageDto, CaseStatusDto } from './cases.enums';

export class CaseListCustomerDto {
  @ApiProperty()
  name!: string;
}

export class CaseListItemDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  customerId!: number;

  @ApiProperty({ type: CaseListCustomerDto })
  customer!: CaseListCustomerDto;

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

  @ApiProperty()
  actionsCount!: number;

  @ApiProperty()
  createdAt!: string;
}
