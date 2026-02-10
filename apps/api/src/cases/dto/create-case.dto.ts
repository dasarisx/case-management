import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCaseDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  customerId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  loanId!: number;
}
