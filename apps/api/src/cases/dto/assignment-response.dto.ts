import { ApiProperty } from '@nestjs/swagger';

export class AssignmentDecisionDto {
  @ApiProperty({ type: [String] })
  matchedRules!: string[];

  @ApiProperty()
  reason!: string;

  @ApiProperty({ required: false })
  assignGroup?: string;
}

export class AssignmentResponseDto {
  @ApiProperty()
  caseId!: number;

  @ApiProperty()
  stage!: string;

  @ApiProperty()
  assignedTo!: string;

  @ApiProperty({ type: AssignmentDecisionDto })
  decision!: AssignmentDecisionDto;
}
