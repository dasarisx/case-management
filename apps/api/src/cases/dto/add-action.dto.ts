import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ActionTypeDto {
  CALL = 'CALL',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
}

export enum ActionOutcomeDto {
  NO_ANSWER = 'NO_ANSWER',
  PROMISE_TO_PAY = 'PROMISE_TO_PAY',
  PAID = 'PAID',
  WRONG_NUMBER = 'WRONG_NUMBER',
}

export class AddActionDto {
  @IsNotEmpty()
  @IsEnum(ActionTypeDto)
  type!: ActionTypeDto;

  @IsNotEmpty()
  @IsEnum(ActionOutcomeDto)
  outcome!: ActionOutcomeDto;

  @IsOptional()
  @IsString()
  notes?: string;
}
