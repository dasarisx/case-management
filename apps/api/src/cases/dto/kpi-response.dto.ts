import { ApiProperty } from '@nestjs/swagger';

export class KpiResponseDto {
  @ApiProperty()
  openCount!: number;

  @ApiProperty()
  resolvedToday!: number;

  @ApiProperty()
  avgDpdOpen!: number;
}
